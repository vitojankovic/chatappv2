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

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{showOnline ? 'Online Users' : 'Top 10 Users'}</h2>
        <button
          onClick={() => setShowOnline(!showOnline)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showOnline ? 'Show Top Karma' : 'Show Online Users'}
        </button>
      </div>
      <ul>
        {users.map((user, index) => (
          <li key={user.id} className="mb-2 flex justify-between items-center">
            <span>
              {showOnline ? '' : `${index + 1}. `}
              <Link href={`/${user.username}`} className="text-blue-500 hover:underline">{user.username}</Link>
              {showOnline && <span className="ml-2 text-green-500">●</span>}
            </span>
            <span className="font-bold">{user.karma} karma</span>
          </li>
        ))}
      </ul>
    </div>
  );
}