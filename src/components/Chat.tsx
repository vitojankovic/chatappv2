'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { sendMessage } from '@/utils/firebaseUtils';
import { User } from '@/types/User'; // Make sure to import the User type

interface ChatProps {
  chatId: string;
  otherParticipant: User; // Add this prop
}

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

export default function Chat({ chatId, otherParticipant }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (doc) => {
      if (doc.exists()) {
        const chatData = doc.data();
        setMessages(chatData.messages || []);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    try {
      await sendMessage(chatId, user.uid, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="text-xl font-semibold">{otherParticipant.username}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === user?.uid ? 'text-right' : 'text-left'}`}>
            <span className="inline-block bg-gray-200 rounded px-2 py-1">
              {message.content}
            </span>
            <br />
            <small className="text-gray-500">
              {new Date(message.timestamp).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full border rounded px-2 py-1"
          placeholder="Type a message..."
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  );
}