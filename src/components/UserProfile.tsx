'use client';

import { useState } from 'react';
import { createChatRequest } from '@/utils/firebase';
import { User } from '@/contexts/AuthContext';

interface UserProfileProps {
  user: {
    id: string;
    username: string;
    bio?: string;
  };
  currentUser: User | null;
}

export default function UserProfile({ user, currentUser }: UserProfileProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChat = async (chatType: 'persistent' | 'oneTime') => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      await createChatRequest(currentUser.uid, user.id, chatType);
      alert('Chat request sent! Wait for the other user to accept.');
    } catch (error) {
      console.error('Error creating chat request:', error);
      alert('Failed to send chat request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-4">{user.username}'s Profile</h1>
      {user.bio && <p className="text-gray-600 mb-4">{user.bio}</p>}
      {currentUser && currentUser.uid !== user.id && (
        <div className="space-y-2">
          <button 
            onClick={() => handleStartChat('persistent')}
            disabled={isLoading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition duration-200"
          >
            Request Persistent Chat
          </button>
          <button 
            onClick={() => handleStartChat('oneTime')}
            disabled={isLoading}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300 transition duration-200"
          >
            Request One-Time Chat
          </button>
        </div>
      )}
    </div>
  );
}