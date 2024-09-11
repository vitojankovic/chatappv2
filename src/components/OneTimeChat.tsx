'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db, sendMessage } from '@/utils/firebase';

interface OneTimeChatProps {
  chatId: string;
}

interface Message {
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatData {
  messages: Message[];
  currentTurn: string;
  phase: 'initial' | 'feedback' | 'discussion';
}

export default function OneTimeChat({ chatId }: OneTimeChatProps) {
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (doc) => {
      if (doc.exists()) {
        setChatData(doc.data() as ChatData);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim() || !chatData) return;

    try {
      await sendMessage(chatId, user.uid, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message.');
    }
  };

  const handleDone = async () => {
    if (!chatData) return;
    const nextTurn = chatData.participants.find(id => id !== user?.uid);
    const nextPhase = chatData.phase === 'initial' ? 'feedback' : 'discussion';
    await updateDoc(doc(db, 'chats', chatId), {
      currentTurn: nextTurn,
      phase: nextPhase,
    });
  };

  if (!chatData || !user) return <div>Loading...</div>;

  const isMyTurn = chatData.currentTurn === user.uid;
  const canSendMessage = isMyTurn && chatData.phase !== 'feedback';

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-purple-100 p-2 text-center">
        <p>Current Phase: {chatData.phase}</p>
        <p>Current Turn: {isMyTurn ? 'Your turn' : "Other user's turn"}</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {chatData.messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.sender === user.uid ? 'text-right' : 'text-left'}`}>
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
          placeholder={canSendMessage ? "Type a message..." : "Wait for your turn..."}
          disabled={!canSendMessage}
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" disabled={!canSendMessage}>
          Send
        </button>
        {isMyTurn && (
          <button 
            type="button" 
            onClick={handleDone} 
            className="mt-2 ml-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            I'm Done
          </button>
        )}
      </form>
    </div>
  );
}