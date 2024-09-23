'use client';

import { useState } from 'react';
import { addToMatchingPool, findMatch, removeFromMatchingPool } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

function RandomChat() {
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleRandomChat = async () => {
    if (!user) return;

    setIsSearching(true);
    try {
      await addToMatchingPool(user.uid, user.karma);
      const match = await findMatch(user.uid, user.karma);
      if (match && 'chatId' in match) {
        router.push(`/chat/${match.chatId}`);
      } else {
        await removeFromMatchingPool(user.uid);
        setIsSearching(false);
        alert('No match found. Please try again later.');
      }
    } catch (error) {
      console.error('Error finding random chat:', error);
      setIsSearching(false);
    }
  };

  return (
    <button 
      onClick={handleRandomChat} 
      disabled={isSearching}
      className="bg-secondary text-white px-6 py-2 rounded hover:bg-opacity-90 transition disabled:opacity-50"
    >
      {isSearching ? 'Searching...' : 'Start Random Chat'}
    </button>
  );
}

export default RandomChat;