'use client';

import { useState, useEffect } from 'react';
import CoinFlip from '@/components/CoinFlip';
import ChatInterface from '@/components/ChatInterface';
import EndChatModal from '@/components/EndChatModal';

export default function ChatPage() {
  const [coinFlipWinner, setCoinFlipWinner] = useState<string | null>(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [showEndChatModal, setShowEndChatModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null); // Replace with actual user type

  useEffect(() => {
    // TODO: Implement Firebase authentication listener
    // setCurrentUser based on Firebase auth state
  }, []);

  const handleCoinFlipComplete = (winner: string) => {
    setCoinFlipWinner(winner);
    setChatStarted(true);
  };

  const handleEndChat = () => {
    setShowEndChatModal(true);
  };

  const handleEndChatConfirm = (accepted: boolean) => {
    if (accepted) {
      // TODO: Implement chat ending logic
      // Update Firebase, close connection, etc.
    }
    setShowEndChatModal(false);
  };

  return (
    <div className="min-h-screen bg-lightBg dark:bg-darkBg text-gray-800 dark:text-gray-200">
      {!chatStarted ? (
        <CoinFlip onComplete={handleCoinFlipComplete} />
      ) : (
        <>
          <div className="text-center py-4">
            <p className="text-xl font-bold">{coinFlipWinner} starts first</p>
          </div>
          <ChatInterface 
            currentUser={currentUser}
            onEndChat={handleEndChat}
          />
        </>
      )}
      {showEndChatModal && (
        <EndChatModal onConfirm={handleEndChatConfirm} />
      )}
    </div>
  );
}