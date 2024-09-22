'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { db } from '@/utils/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import Send from './send (2).svg'
import Image from 'next/image';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: any;
}

interface User {
  uid: string;
  username: string;
}

export default function DirectChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const { user } = useAuth();
  const params = useParams();
  const chatId = params?.chatId as string;

  useEffect(() => {
    if (!chatId) return;

    const q = query(collection(db, `chats/${chatId}/messages`), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const fetchOtherUser = async () => {
      if (!chatId || !user) return;

      const chatDoc = await getDoc(doc(db, 'chats', chatId));
      if (chatDoc.exists()) {
        const participants = chatDoc.data().participants;
        const otherUserId = participants.find((id: string) => id !== user.uid);
        if (otherUserId) {
          const userDoc = await getDoc(doc(db, 'users', otherUserId));
          if (userDoc.exists()) {
            setOtherUser({ uid: userDoc.id, ...userDoc.data() } as User);
          }
        }
      }
    };

    fetchOtherUser();
  }, [chatId, user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      text: newMessage,
      senderId: user.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  return (
<div className="container mx-auto px-4 py-8 h-screen overflow-y-auto mt-[70px]">
  <div className="bg-laccent border-[4px] border-dark rounded-[6px] dark:bg-daccent dark:border-[4px] dark:border-light dark:border-opacity-5 border-opacity-5 p-4 h-[calc(100vh-16rem)] overflow-y-auto mb-4 md:mr-[10vw]">
    {messages.map((message) => (
      <div key={message.id} className={`mb-3 flex ${message.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
        <span className={`inline-block p-3 rounded-lg ${message.senderId === user?.uid ? 'bg-primarylight text-light' : 'bg-laccent border-[1px] border-[1px] border-dark rounded-[6px] dark:border-[1px] dark:border-light dark:border-opacity-5 border-opacity-5 dark:bg-daccent dark:text-light text-dark'}`}>
          {message.text}
        </span>
      </div>
    ))}
  </div>
  <form  onSubmit={sendMessage} className="flex items-center md:w-[calc(83%)]">
    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      className="flex-grow mr-2 p-3 bg-laccent border-[4px] border-dark rounded-[6px] dark:bg-daccent dark:border-[4px] dark:border-light border-opacity-5  focus:outline-none focus:ring-2 focus:ring-primary placeholder-dark dark:placeholder-light text-lg w-[calc(100%-57px)]"
      placeholder="Write a Message"
      style={{ fontSize: '1.125rem' }}
    />
    <button type="submit" className="bg-laccent border-[4px] border-dark rounded-[6px] dark:bg-daccent dark:border-[4px] dark:border-light border-opacity-5 p-2 h-[57px] w-[57px] flex items-center justify-center">
      <Image className="dark:invert" src={Send} alt="Send" width={50} height={50} />
    </button>
  </form>
</div>

  );
}