'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import X from './x.svg';
import Logo from './mentforment.svg';

export default function Navbar() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isMounted) {
    return null; // or a loading placeholder
  }

  return (
    <nav className="fixed left-0 w-full z-10 md:top-[25px] top-0 transition-colors duration-800 ease-out">
      <div className="md:container md:mx-auto md:px-4 w-full">
        <div className={`flex items-center transition-colors duration-800 ease-out ${
          isScrolled 
            ? 'md:bg-laccent/70 dark:md:bg-daccent/70 md:backdrop-blur-md bg-primary dark:bg-primary-dark' 
            : 'md:bg-laccent dark:md:bg-da bg-transparent dark:bg-daccent'
        } md:h-16 md:rounded-[8px] h-[80px] w-full`}>
          <div className="flex items-center px-6">
            <Link href="/" className={`text-xl font-bold transition-colors duration-800 ease-out ${
              isScrolled ? 'md:text-primary dark:md:text-light text-white dark:text-light' : 'text-primary dark:text-light'
            } flex items-center`}>
              <Image src={Logo} alt="Mentforment Logo" width={120} height={40} className="w-auto h-8 md:h-10" />
            </Link>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="ml-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <Image
                src={theme === 'dark' ? '/light.gif' : '/dark.gif'}
                alt={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex flex-grow justify-center items-center space-x-8">
            <Link href="/find-match" className="text-lg font-semibold text-dark dark:text-light">
              Find a match
            </Link>
            <Link href="/leaderboard" className="text-lg font-semibold text-dark dark:text-light">
              Leaderboard
            </Link>
            <Link href="/chats" className="text-lg font-semibold text-dark dark:text-light">
              Chats
            </Link>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:block px-6">
            {user ? (
              <Link href={`/${user.username}`} className="text-lg font-semibold text-dark dark:text-light">
                {user.username}
              </Link>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login" className="text-lg font-semibold text-primary dark:text-light border border-primary dark:border-light px-3 py-1 rounded-md hover:bg-primary hover:text-white dark:hover:bg-light dark:hover:text-primary transition-all duration-300">
                  Login
                </Link>
                <Link href="/signup" className="text-lg font-semibold text-white bg-primary px-3 py-1 rounded-md hover:bg-transparent hover:text-primary dark:hover:text-light hover:border hover:border-primary dark:hover:border-light transition-all duration-300">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className={`md:hidden ml-auto mr-4 ${isScrolled ? 'text-white dark:text-light' : 'text-primary dark:text-light'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-y-0 right-0 bg-primary dark:bg-daccent z-20 w-[60%] shadow-lg">
          <div className="flex flex-col p-6">
            <button 
              className="self-end mb-6"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image src={X} alt="Close menu" width={24} height={24} className="invert dark:invert-0" />
            </button>
            <div className="flex flex-col space-y-6">
              <Link href="/find-match" className="text-lg font-semibold text-white dark:text-light">
                Find a match
              </Link>
              <Link href="/leaderboard" className="text-lg font-semibold text-white dark:text-light">
                Leaderboard
              </Link>
              <Link href="/chats" className="text-lg font-semibold text-white dark:text-light">
                Chats
              </Link>
              {user ? (
                <Link href={`/${user.username}`} className="text-lg font-semibold text-white dark:text-light">
                  {user.username}
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-lg font-semibold text-white dark:text-light border border-white dark:border-light px-3 py-1 rounded-md hover:bg-white hover:text-primary dark:hover:bg-light dark:hover:text-daccent transition-all duration-300">
                    Login
                  </Link>
                  <Link href="/signup" className="text-lg font-semibold text-primary dark:text-daccent bg-white dark:bg-light px-3 py-1 rounded-md hover:bg-transparent hover:text-white dark:hover:text-light hover:border hover:border-white dark:hover:border-light transition-all duration-300">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}