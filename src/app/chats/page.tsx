'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/utils/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';

interface Chat {
  id: string;
  participants: string[];
  isLive: boolean;
  lastMessage?: string;
  lastMessageTimestamp?: any;
}

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Chat[];
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Chats</h1>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="mb-2">
            <Link href={`/chat/${chat.id}`} className="text-blue-500 hover:underline">
              {chat.isLive ? 'Live Chat' : 'Persistent Chat'} - 
              {chat.lastMessage ? ` Last message: ${chat.lastMessage}` : ' No messages yet'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}