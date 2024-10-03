'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '@/utils/firebase';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { useRouter, useParams } from 'next/navigation';

interface Chat {
  id: string;
  participants: string[];
  isLive: boolean;
  lastMessage?: string;
  lastMessageTimestamp?: string;
}

interface User {
  username: string;
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [users, setUsers] = useState<{[key: string]: User}>({});
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const currentChatId = params?.chatId as string;

  useEffect(() => {
    if (!user?.uid) return;

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
      
      // Fetch user data for each participant
      chatsData.forEach(chat => {
        chat.participants.forEach(async (participantId) => {
          if (participantId !== user.uid && !users[participantId]) {
            const userDoc = await getDoc(doc(db, 'users', participantId));
            if (userDoc.exists()) {
              setUsers(prevUsers => ({
                ...prevUsers,
                [participantId]: userDoc.data() as User
              }));
            }
          }
        });
      });
    });

    return () => unsubscribe();
  }, [user]);

  const handleChatClick = (chat: Chat) => {
    if (window.innerWidth < 640) {
      router.push(`/chats/${chat.id}`);
    } else {
      router.push(`/chats/${chat.id}`, { scroll: false });
    }
  };

  console.log(chats)

  return (
    <div className={`${currentChatId ? 'hidden sm:block ml-[10vw]' : ''} w-full sm:w-1/3 ml-[12vw] bg-laccent dark:bg-daccent rounded-[6px] h-[calc(100vh-16rem)] overflow-y-auto mt-[100px] bg-laccent border-[4px] border-dark rounded-[6px] dark:bg-daccent dark:border-[4px] dark:border-light dark:border-opacity-5 border-opacity-5`}>
      <h1 className="text-2xl font-bold p-4 text-dark dark:text-light">Your Chats</h1>
      {chats.length === 0 ? (
        <p className="p-4 text-dark dark:text-light">No chats found.</p>
      ) : (
        <ul>
          {chats.map((chat) => {
            console.log("ChAT: ", chat)

            console.log(users)


            const otherParticipantId = chat.participants.find(p => p !== user?.uid);
            const otherParticipantName = otherParticipantId && users[otherParticipantId]
              ? users[otherParticipantId].username
              : 'Loading...';
            
            return (
              <li 
                key={chat.id} 
                className={`p-4 cursor-pointer hover:bg-hover dark:hover:bg-hover-dark transition-colors
                  ${currentChatId === chat.id ? 'bg-selected dark:bg-selected-dark' : ''}`}
                onClick={() => handleChatClick(chat)}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-dark dark:text-light">
                      {otherParticipantName}
                    </p>
                    <p className="text-sm text-secondary dark:text-secondary-dark truncate">
                      {chat.lastMessage || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}