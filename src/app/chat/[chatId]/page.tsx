'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import Chat from '@/components/Chat';
import OneTimeChat from '@/components/OneTimeChat';

export default function ChatPage() {
  const { chatId } = useParams();
  const [chatType, setChatType] = useState<'persistent' | 'oneTime' | null>(null);

  useEffect(() => {
    async function fetchChatType() {
      if (typeof chatId === 'string') {
        const chatDoc = await getDoc(doc(db, 'chats', chatId));
        if (chatDoc.exists()) {
          setChatType(chatDoc.data().chatType);
        }
      }
    }

    fetchChatType();
  }, [chatId]);

  if (!chatType) return <div>Loading...</div>;

  if (chatType === 'persistent') {
    return <Chat chatId={chatId as string} />;
  } else {
    return <OneTimeChat chatId={chatId as string} />;
  }
}