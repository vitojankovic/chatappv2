'use client';

import { useState, useEffect } from 'react';
import { db, getOnlineUsers } from '@/utils/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';

interface LeaderboardUser {
  id: string;
  username: string;
  karma: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [showOnline]);

  const fetchUsers = async () => {
    setLoading(true);
    let fetchedUsers: LeaderboardUser[];
    
    if (showOnline) {
      fetchedUsers = await getOnlineUsers();
    } else {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('karma', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      fetchedUsers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        username: doc.data().username,
        karma: doc.data().karma,
      }));
    }
    
    setUsers(fetchedUsers);
    setLoading(false);
  };

  if (loading) return <div className="text-primary dark:text-primarylight text-center">Loading users...</div>;

  return (
    <div className="bg-light dark:bg-dark transition-colors duration-800 ease-out p-6 rounded-lg shadow-lightshadow dark:shadow-lightshadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary dark:text-primarylight">{showOnline ? 'Online Users' : 'Top 10 Users'}</h2>
        <button
          onClick={() => setShowOnline(!showOnline)}
          className="bg-primary text-white hover:bg-transparent hover:text-primary border-2 border-primary font-semibold py-2 px-4 rounded-lg transition-colors ease-out duration-300"
        >
          {showOnline ? 'Show Top Karma' : 'Show Online Users'}
        </button>
      </div>
      <ul className="space-y-4">
        {users.map((user, index) => (
          <li key={user.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out">
            <span className="flex items-center space-x-3">
              {!showOnline && <span className="text-lg font-semibold text-primary dark:text-primarylight">{index + 1}.</span>}
              <Link href={`/${user.username}`} className="text-primary dark:text-primarylight hover:underline font-medium text-lg">
                {user.username}
              </Link>
              {showOnline && <span className="ml-2 text-green-500">●</span>}
            </span>
            <span className="text-primary dark:text-primarylight font-bold">{user.karma} karma</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
