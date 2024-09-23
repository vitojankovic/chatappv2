'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import X from './x.svg';
import Logo from './mentforment (2).svg';
import Bell from './bell.svg';
import User from './user.svg';

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
    <nav className="fixed left-0 w-full z-10 md:top-[25px] top-0 transition-colors duration-800 ease-out z-50">
      <div className="md:container md:mx-auto md:px-4 w-full">
        <div className={`flex items-center transition-colors duration-800 ease-out ${
          isScrolled 
            ? 'md:bg-laccent/40 dark:md:bg-daccent/40 md:backdrop-blur-md bg-primary/90 dark:bg-primary-dark/90' 
            : 'md:bg-laccent dark:md:bg-daccent'
        } md:h-16 md:rounded-[8px] h-[80px] w-full`}>
          <div className="flex items-center px-6">
            <Link href="/" className={`text-xl font-bold transition-colors duration-800 ease-out ${
              isScrolled 
                ? 'md:text-primary dark:md:text-light text-white' 
                : 'text-primary dark:text-light'
            } flex items-center`}>
              <Image src={Logo} alt="Mentforment Logo" width={120} height={40} className='w-auto h-8 md:h-10 dark:invert' />
            </Link>
            {/* Move theme toggle button to desktop only */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="ml-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 hidden md:block"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f1f1f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`feather feather-sun ${theme === 'dark' ? 'text-light' : 'text-dark'}`}>
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-moon">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
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
              <div className="flex items-center space-x-4">
                <Link href="/notifications">
                  <Image 
                    src={Bell} 
                    alt="Notifications" 
                    width={24} 
                    height={24} 
                    className="cursor-pointer dark:invert"
                  />
                </Link>
                <div className="w-8 h-8 rounded-full border-2 dark:border-light border-dark overflow-hidden">
                  <Link href={`/${user.username}`}>
                    <Image 
                      src={User} 
                      alt={user.username} 
                      width={32} 
                      height={32} 
                      className="w-full h-full object-cover dark:invert"
                    />
                  </Link>
                </div>
              </div>
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
            className={`md:hidden ml-auto mr-4 ${
              isScrolled ? 'text-white' : 'text-primary dark:text-light'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-menu">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
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
              {/* Add theme toggle button to mobile menu */}
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                className="flex items-center text-lg font-semibold text-white dark:text-light"
              >
                {theme === 'dark' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun mr-2">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    Light Mode
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-moon mr-2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>
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