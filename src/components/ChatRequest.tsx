'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { acceptChatRequest, rejectChatRequest } from '@/utils/firebase';

interface ChatRequestProps {
  requestId: string;
  senderName: string;
  chatType: 'persistent' | 'oneTime';
}

export default function ChatRequest({ requestId, senderName, chatType }: ChatRequestProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      const chatId = await acceptChatRequest(requestId);
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error('Error accepting chat request:', error);
      alert('Failed to accept chat request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await rejectChatRequest(requestId);
      alert('Chat request rejected.');
    } catch (error) {
      console.error('Error rejecting chat request:', error);
      alert('Failed to reject chat request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <p className="mb-2">
        {senderName} wants to start a {chatType === 'persistent' ? 'persistent' : 'one-time'} chat with you.
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={handleReject}
          disabled={isLoading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
        >
          Reject
        </button>
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-green-300"
        >
          Accept
        </button>
      </div>
    </div>
  );
}