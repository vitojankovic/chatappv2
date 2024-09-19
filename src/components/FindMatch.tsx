import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { findMatch, addToMatchingPool, removeFromMatchingPool, getOnlineUsersCount, getUsersSearchingCount, getUserKarma, setPresence, db } from '../utils/firebase';
import { useRouter } from 'next/navigation';
import { onSnapshot, collection, query, where, limit } from 'firebase/firestore';

export default function FindMatch() {
    const [loading, setLoading] = useState(false);
    const [searchTime, setSearchTime] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState(0);
    const [searchingUsers, setSearchingUsers] = useState(0);
    const { user } = useAuth();
    const router = useRouter();
    const [matchError, setMatchError] = useState<string | null>(null);
    const [karmaRange, setKarmaRange] = useState(100);

    // Define fetchCounts outside useEffect to make it accessible in multiple useEffects
    const fetchCounts = async () => {
        try {
            const onlineCount = await getOnlineUsersCount();
            const searchingCount = await getUsersSearchingCount();
            setOnlineUsers(onlineCount);
            setSearchingUsers(searchingCount);
        } catch (error) {
            console.error('Error fetching counts:', error);
        }
    };

    useEffect(() => {
        fetchCounts();
        const interval = setInterval(fetchCounts, 5000); // Fetch counts every 5 seconds

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loading) {
            timer = setInterval(() => {
                setSearchTime(prev => prev + 1);
            }, 1000); // Increment search time every second
        }
        return () => clearInterval(timer);
    }, [loading]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (loading) {
            timer = setInterval(() => {
                setKarmaRange(prevRange => prevRange + 50);  // Widen range by 50 every 10 seconds
            }, 10000);  // Increment karma range every 10 seconds
        }

        return () => clearInterval(timer);
    }, [loading]);

    const handleFindMatch = async () => {
        if (!user || loading) return;
        setLoading(true);
        setSearchTime(0);

        try {
            if (user.karma === undefined) {
                throw new Error("User karma is undefined");
            }

            // Add user to matching pool
            await addToMatchingPool(user.uid, user.karma);
            setSearchingUsers(prev => prev + 1);

            // The onSnapshot listener will handle the matching
        } catch (error) {
            console.error('Error finding match:', error);
            alert('An error occurred while finding a match. Please try again.');
            if (user) {
                await removeFromMatchingPool(user.uid);
            }
            setSearchingUsers(prev => Math.max(0, prev - 1));
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!user || !loading) return;
        setLoading(false);
        setSearchTime(0);
        try {
            await removeFromMatchingPool(user.uid);
            // The removeFromMatchingPool function handles decrementing the searching users count
        } catch (error) {
            console.error('Error removing from matching pool:', error);
            setMatchError('An error occurred while canceling the search. Please try again.');
        }
    };

    // Real-time matching pool listener
    useEffect(() => {
        if (!loading || !user) return;

        const matchPoolRef = collection(db, 'matchingPool');
        const q = query(
            matchPoolRef,
            where('karma', '>=', user.karma - karmaRange),
            where('karma', '<=', user.karma + karmaRange),
            limit(1)  // Limit to 1 match for quicker response
        );

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            if (!snapshot.empty) {
                const match = snapshot.docs[0];
                if (match.id !== user.uid) {  // Ensure not matching with self
                    // Remove matched user from pool
                    await removeFromMatchingPool(match.id);
                    // Remove self from pool
                    await removeFromMatchingPool(user.uid);
                    setLoading(false);
                    setSearchingUsers(prev => prev - 1);
                    router.push(`/one-time-chat/${match.id}`);
                }
            }
        });

        // Cleanup listener on unmount
        return () => {
            unsubscribe();
            if (user) {
                removeFromMatchingPool(user.uid).catch(err => console.error('Error removing user on cleanup:', err));
            }
        };
    }, [loading, user, karmaRange, router]);

    useEffect(() => {
        const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
            if (loading && user) {
                await removeFromMatchingPool(user.uid);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [loading, user]);

    useEffect(() => {
        if (user) {
            setPresence(user.uid);
        }
    }, [user]);

    useEffect(() => {
        if (user && user.karma === undefined) {
            console.error('User karma is undefined. User object:', user);
            // Handle this case, perhaps by fetching the user's data again or showing an error message
        }
    }, [user]);

    return (
        <div className="find-match-container mt-[100px]">
            <div className="stats">
                <p>Online Users: {onlineUsers}</p>
                <p>Users Searching: {searchingUsers}</p>
                {loading && <p>Searching for {searchTime} seconds</p>}
                {matchError && <p className="error">{matchError}</p>}
            </div>
            {!loading ? (
                <button onClick={handleFindMatch} className="find-match-button">
                    Find Match
                </button>
            ) : (
                <div>
                    <div className="loader"></div>  {/* Display a loading spinner */}
                    <button onClick={handleCancel} className="cancel-button">
                        Cancel Search
                    </button>
                </div>
            )}
        </div>
    );
}