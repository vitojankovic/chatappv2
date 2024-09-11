'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// Import SVG files
import LeftHandSvg from '@/images/left-hand.svg';
import CoinSvg from '@/images/coin.svg';

const sloganWords = ['product', 'service', 'idea'];

export default function LandingPage() {
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prevIndex) => (prevIndex + 1) % sloganWords.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Get instant feedback on your{' '}
            <span className="text-blue-600 transition-all duration-300">
              {sloganWords[sloganIndex]}
            </span>
          </h1>
        </div>
        <div className="relative w-full max-w-4xl mx-auto h-96">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[300px] h-[300px]">
            <Image src={LeftHandSvg} alt="Left Hand" layout="fill" />
          </div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px]">
            <Image src={CoinSvg} alt="Coin" layout="fill" />
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-180 w-[300px] h-[300px]">
            <Image src={LeftHandSvg} alt="Right Hand (rotated left hand)" layout="fill" />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-center mb-2">Connect</h3>
            <p className="text-gray-600 text-center">Find mentors and peers in your industry</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-center mb-2">Chat</h3>
            <p className="text-gray-600 text-center">Discuss your ideas and get valuable feedback</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-center mb-2">Grow</h3>
            <p className="text-gray-600 text-center">Improve your products and services</p>
          </div>
        </div>
      </div>
    </div>
  );
}