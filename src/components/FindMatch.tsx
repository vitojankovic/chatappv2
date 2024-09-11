'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { findMatch, addToMatchingPool, removeFromMatchingPool } from '../utils/firebase';
import { useRouter } from 'next/navigation';

export default function FindMatch() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    return () => {
      // Clean up: remove user from matching pool if component unmounts
      if (user) {
        removeFromMatchingPool(user.uid);
      }
    };
  }, [user]);

  const handleFindMatch = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      // Add the current user to the matching pool
      await addToMatchingPool(user.uid);
      
      let matchFound = false;
      const startTime = Date.now();
      
      // Start polling for a match
      const pollInterval = setInterval(async () => {
        const match = await findMatch(user.uid);
        if (match) {
          clearInterval(pollInterval);
          matchFound = true;
          router.push(`/chat/${match.chatId}`);
        } else if (Date.now() - startTime > 30000) { // 30 seconds timeout
          clearInterval(pollInterval);
          setLoading(false);
          removeFromMatchingPool(user.uid);
          alert('No match found. Please try again later.');
        }
      }, 2000); // Poll every 2 seconds

      // Cleanup function
      return () => {
        if (!matchFound) {
          clearInterval(pollInterval);
          removeFromMatchingPool(user.uid);
        }
      };

    } catch (error) {
      console.error('Error finding match:', error);
      alert('An error occurred while finding a match. Please try again.');
      removeFromMatchingPool(user.uid);
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setLoading(false);
    if (user) {
      removeFromMatchingPool(user.uid);
    }
  };

  return (
    <>
      <button
        onClick={handleFindMatch}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded mr-2"
      >
        {loading ? 'Searching for match...' : 'Find a match'}
      </button>
      {loading && (
        <button
          onClick={handleCancel}
          className="bg-red-500 text-white p-2 rounded"
        >
          Cancel
        </button>
      )}
    </>
  );
}