import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addToMatchingPool, removeFromMatchingPool, getOnlineUsersCount, getUsersSearchingCount, setPresence, db } from '../utils/firebase';
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
            setSearchingUsers(prev => Math.max(0, prev));
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
                  try {
                      // Remove both users from the pool
                      await removeFromMatchingPool(match.id);
                      await removeFromMatchingPool(user.uid);
  
                      // Redirect to a shared game session
                      setLoading(false);
                      setSearchingUsers(prev => prev - 1);
                      router.push(`/one-time-chat/${match.id}`);
                  } catch (error) {
                      console.error('Error handling match:', error);
                  }
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
        const handleBeforeUnload = async () => {
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
<div className="flex justify-center items-center min-h-screen">
  <div className="bg-laccent dark:bg-daccent border-[4px] border-dark rounded-[8px] dark:border-light border-opacity-5 dark:border-opacity-5 transition-colors duration-800 ease-out p-6 shadow-lightshadow dark:shadow-darkshadow md:max-w-xl w-full sm:w-[90%] md:w-[80%] w-[90vw]">
    <div className="mt-[50px] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-4xl font-bold mb-8 text-dark dark:text-light">
        Ready for a battle?
      </h2>

      {!loading ? (
        <button 
          onClick={handleFindMatch} 
          className="bg-primary hover:bg-primarylight text-light font-semibold py-4 px-8 rounded-[8px] transition duration-300 ease-in-out transform hover:scale-105 shadow-md text-xl"
        >
          Find a match
        </button>
      ) : (
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <button 
            onClick={handleCancel} 
            className="bg-errorcolor hover:bg-red-700 text-light font-semibold py-2 px-6 rounded-[8px] transition duration-300 ease-in-out"
          >
            Cancel Search
          </button>
        </div>
      )}

      <div className="mt-8 flex space-x-8 text-dark dark:text-light">
        <p>
          <span className="font-semibold">{onlineUsers}</span> online users
        </p>
        <p>
          <span className="font-semibold">{searchingUsers}</span> users searching
        </p>
      </div>

      {loading && (
        <p className="mt-4 text-dark dark:text-light">
          Searching for {searchTime} seconds
        </p>
      )}

      {matchError && (
        <p className="mt-4 text-errorcolor">
          {matchError}
        </p>
      )}
    </div>
  </div>
</div>
    );
}