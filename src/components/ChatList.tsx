'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/utils/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

interface Chat {
  id: string;
  participants: string[];
  isLive: boolean;
  lastMessage?: string;
  lastMessageTimestamp?: any;
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const authState = useAuth();

  console.log('AuthState in OneTimeChat:', authState);

  const user = authState.user;

  useEffect(() => {
    console.log('UseEffect triggered, user:', user);
    if (!user || !user.uid) return;

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
  }, [user]);

  if (authState.loading) {
    return <div>Loading user data...</div>;
  }

  if (!user || !user.uid) {
    return (
      <div>
        <p>User data is incomplete. Please try logging in again.</p>
        <p>Auth state: {JSON.stringify(authState, null, 2)}</p>
        <button onClick={() => {/* Add a function to trigger re-authentication */}}>
          Re-authenticate
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Chats</h1>
      <p>User UID: {user.uid}</p>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} className="mb-2">
            <Link href={`/chats/${chat.id}`} className="text-blue-500 hover:underline">
              {chat.isLive ? 'Live Chat' : 'Persistent Chat'} - 
              {chat.lastMessage ? ` Last message: ${chat.lastMessage}` : ' No messages yet'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}