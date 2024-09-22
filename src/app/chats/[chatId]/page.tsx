'use client';

import React from 'react';
import ChatList from '@/components/ChatList';
import DirectChatPage from '@/components/DirectChatPage';

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-background dark:bg-background-dark">
      <ChatList />
      <div className="w-full sm:w-2/3 h-screen">
        <DirectChatPage />
      </div>
    </div>
  );
}
