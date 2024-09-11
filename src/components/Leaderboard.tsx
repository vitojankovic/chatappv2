'use client';

import { useState, useEffect } from 'react';
import { db } from '@/utils/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';

interface LeaderboardUser {
  username: string;
  karma: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopUsers() {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('karma', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const topUsers = querySnapshot.docs.map(doc => ({
        username: doc.data().username,
        karma: doc.data().karma
      }));
      setUsers(topUsers);
      setLoading(false);
    }

    fetchTopUsers();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Top 10 Users</h2>
      <ul>
        {users.map((user, index) => (
          <li key={user.username} className="mb-2 flex justify-between items-center">
            <span>{index + 1}. <Link href={`/${user.username}`} className="text-blue-500 hover:underline">{user.username}</Link></span>
            <span className="font-bold">{user.karma} karma</span>
          </li>
        ))}
      </ul>
    </div>
  );
}