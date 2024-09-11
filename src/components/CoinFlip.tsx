'use client';

import { useState, useEffect } from 'react';

interface CoinFlipProps {
  onComplete: (winner: string) => void;
}

export default function CoinFlip({ onComplete }: CoinFlipProps) {
  const [flipping, setFlipping] = useState(true);

  useEffect(() => {
    const flipDuration = 3000; // 3 seconds for the animation
    const timer = setTimeout(() => {
      setFlipping(false);
      const winner = Math.random() < 0.5 ? 'User 1' : 'User 2';
      onComplete(winner);
    }, flipDuration);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className={`w-32 h-32 rounded-full bg-yellow-400 ${flipping ? 'animate-spin' : ''}`}>
        {/* Add more detailed coin design here */}
      </div>
    </div>
  );
}