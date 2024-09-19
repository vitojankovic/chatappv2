'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { db, getUserById } from '../../../utils/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
}

export default function DirectChatPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const chatId = params?.chatId as string;
  const [otherUser, setOtherUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isParticipant, setIsParticipant] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      if (user && chatId) {
        try {
          const chatDoc = await getDoc(doc(db, 'chats', chatId));
          if (!chatDoc.exists()) {
            throw new Error('Chat not found');
          }

          const chatData = chatDoc.data();
          const participants = chatData.participants;

          // Check if the current user is a participant
          if (!participants.includes(user.uid)) {
            setError('You are not authorized to view this chat.');
            setLoading(false);
            return;
          }

          setIsParticipant(true);

          const otherUserId = participants.find((id: string) => id !== user.uid);
          const otherUserData = await getUserById(otherUserId);
          setOtherUser(otherUserData);

          // Set up real-time listener for messages
          const messagesRef = collection(db, 'chats', chatId, 'messages');
          const q = query(messagesRef, orderBy('timestamp', 'asc'));
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Message));
            setMessages(newMessages);
          });

          setLoading(false);
          return () => unsubscribe();
        } catch (err) {
          console.error('Error initializing chat:', err);
          setError('Failed to load chat. Please try again.');
          setLoading(false);
        }
      }
    };

    initializeChat();
  }, [user, chatId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user && chatId && isParticipant) {
      try {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        await addDoc(messagesRef, {
          text: newMessage,
          senderId: user.uid,
          timestamp: serverTimestamp()
        });
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Failed to send message. Please try again.');
      }
    }
  };

  if (loading) {
    return <div>Loading chat...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!isParticipant) {
    return <div>You are not authorized to view this chat.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-[100px]">
      <h1 className="text-2xl font-bold mb-4">Chat with {otherUser?.username}</h1>
      <div className="bg-white shadow-md rounded-lg p-4 h-96 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div key={message.id} className={`mb-2 ${message.senderId === user?.uid ? 'flex justify-end' : 'flex justify-start'}`}>
            <span className={`inline-block p-2 rounded-lg ${message.senderId === user?.uid ? 'bg-color-primary text-white' : 'bg-[#EAE7E4]'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow mr-2 p-2 rounded-lg bg-[#EAE7E4] border-2 border-[#111111] border-opacity-[0.0667]"
          placeholder="Write a Message"
        />
        <button type="submit" className="bg-transparent p-2">
          <img src="/paper-plane.gif" alt="Send" className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}
