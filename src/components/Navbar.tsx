'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-[50px] left-1/2 -translate-x-1/2 w-[80%] max-w-[1728px] h-[70px] rounded-[4px] z-10 transition-all duration-300 ${
      isScrolled ? 'bg-[#d9d9d9]/70 backdrop-blur-md' : 'bg-[#d9d9d9]'
    }`}>
      <div className="flex justify-between items-center h-full px-6">
        <Link href="/" className="text-xl font-bold text-[#111111]">
          Home
        </Link>
        <div className="flex space-x-4">
          <Link href="/find-match" className="text-lg font-semibold text-[#111111]">
            Find a match
          </Link>
          <Link href="/past-chats" className="text-lg font-semibold text-[#111111]">
            Past Chats
          </Link>
          <Link href="/leaderboard" className="text-lg font-semibold text-[#111111]">
            Leaderboard
          </Link>
          <Link href={user ? `/${user.username}` : "/login"} className="text-lg font-semibold text-[#111111]">
            Account
          </Link>
        </div>
      </div>
    </nav>
  );
}