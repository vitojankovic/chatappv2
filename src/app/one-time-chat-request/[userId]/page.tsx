'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { sendChatRequest } from '../../../utils/firebase';

export default function OneTimeChatRequestPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const receiverId = params?.userId as string;
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to send a request');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await sendChatRequest(user.uid, receiverId, 'oneTime');
      console.log('Chat request sent successfully');
      router.push('/notifications'); // Redirect to notifications page after sending request
    } catch (error) {
      console.error('Error sending chat request:', error);
      setError('Failed to send chat request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Please log in to send a one-time chat request.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[100px]">
      <h1 className="text-2xl font-bold mb-4">Send One-Time Chat Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block mb-1">Message (optional)</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-2 border rounded flex-grow mr-2 p-3 bg-laccent border-[4px] border-dark rounded-[6px] dark:bg-daccent dark:border-[4px] dark:border-light border-opacity-5  focus:outline-none focus:ring-2 focus:ring-primary placeholder-dark dark:placeholder-light text-lg w-[calc(100%-57px)]"
            placeholder="Enter a message for your request..."
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button 
          type="submit" 
          className="bg-primary mx-auto text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Request'}
        </button>
      </form>
    </div>
  );
}