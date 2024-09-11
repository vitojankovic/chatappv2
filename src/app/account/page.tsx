'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/utils/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Account() {
  const { user } = useAuth();
  const [bio, setBio] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user && user.bio) {
      setBio(user.bio);
    }
  }, [user]);

  const handleUpdateBio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        bio: bio
      });
      setMessage('Bio updated successfully!');
    } catch (error) {
      console.error('Error updating bio:', error);
      setMessage('Failed to update bio. Please try again.');
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lightBg dark:bg-darkBg">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Account</h1>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
        <p>Karma: {user.karma}</p>
        <form onSubmit={handleUpdateBio} className="mt-4">
          <textarea
            placeholder="Tell us about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Update Bio
          </button>
        </form>
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
}