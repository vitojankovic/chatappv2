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
    <nav className="fixed top-[25px] left-0 w-full z-10">
      <div className="container mx-auto px-4">
        <div className={`flex items-center h-16 rounded-[8px] transition-all duration-300 ${
          isScrolled ? 'bg-[#d9d9d9]/70 backdrop-blur-md' : 'bg-[#d9d9d9]'
        }`}>
          <Link href="/" className="text-xl font-bold text-primary px-6">
            Home
          </Link>
          <div className="flex-grow flex justify-center items-center space-x-8">
            <Link href="/find-match" className="text-lg font-semibold text-dark">
              Find a match
            </Link>
            <Link href="/leaderboard" className="text-lg font-semibold text-dark">
              Leaderboard
            </Link>
            <Link href="/pricing" className="text-lg font-semibold text-dark">
              Pricing
            </Link>
          </div>
          <div className="px-6">
            {user ? (
              <Link href={`/${user.username}`} className="text-lg font-semibold text-dark">
                {user.username}
              </Link>
            ) : (
              <Link href="/login" className="text-lg font-semibold text-dark whitespace-nowrap">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}