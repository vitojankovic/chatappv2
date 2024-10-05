'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import X from './x (1).svg';
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
    <nav className="fixed left-0 w-full z-20 md:top-[25px] top-0 transition-colors duration-800 ease-out z-50">
      <div className="md:container md:mx-auto md:px-4 w-full">
        <div className={`flex items-center transition-colors duration-800 ease-out ${isScrolled 
          ? 'bg-laccent md:bg-laccent/40 dark:bg-daccent dark:md:bg-daccent/40 md:backdrop-blur-md bg-laccent/90 dark:bg-daccent-dark/90 shadow-sm' 
          : 'bg-laccent dark:bg-daccent shadow-sm'
        } md:h-16 md:rounded-[8px] h-[80px] w-full`}>
          <div className="flex items-center px-6">
            <Link href="/" className={`text-xl font-bold transition-colors duration-800 ease-out ${isScrolled 
              ? 'md:text-primary dark:md:text-light text-white' 
              : 'text-primary dark:text-light'
            } flex items-center`}>
              <motion.div 
                whileHover={{ rotate: 360 }} 
                transition={{ duration: 0.6 }}
              >
                <Image src={Logo} alt="Mentforment Logo" width={120} height={40} className='w-auto h-8 md:h-10 dark:invert' />
              </motion.div>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon">
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
            className={"md:hidden ml-auto mr-4 border-dark dark:border-light rounded-[6px] px-[1px] py-[1px] border-[2px]"}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
  <motion.div 
    className="fixed inset-0 bg-laccent dark:bg-daccent z-20 flex flex-col items-center justify-start p-8 pb-[20vh]" // Increased padding
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* Logo at the top */}
    <motion.div 
      className="flex justify-between w-full mb-8" // Increased margin bottom
    >
      <Image src={Logo} alt="Mentforment Logo" width={140} height={46} className='w-auto h-10 dark:invert' /> {/* Adjusted size */}
      <button 
        className="border-dark dark:border-light rounded-[8px] px-[2px] py-[2px] border-[2px]" // Slightly increased border radius and padding
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Image src={X} alt="Close menu" width={28} height={28} className="dark:invert"  /> {/* Adjusted size */}
      </button>
    </motion.div>

    <motion.div 
      className="flex flex-col items-center justify-center space-y-8 h-[100%] w-[100%] pt-[-75px]" // Increased spacing between items
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: 20 }} 
      transition={{ duration: 0.2 }}
    >
                   <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                className="flex items-center text-lg font-semibold text-dark dark:text-light text-xl"
              >
                {theme === 'dark' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun mr-2">
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-moon mr-2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                    Dark Mode
                  </>
                )}
              </button>
      <Link href="/find-match" className="flex items-center text-xl font-semibold text-dark dark:text-light"> {/* Increased text size */}
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3"> {/* Increased size */}
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        Find a match
      </Link>
      
      <Link href="/leaderboard" className="flex items-center text-xl font-semibold text-dark dark:text-light">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
        </svg>
        Leaderboard
      </Link>
      
      <Link href="/chats" className="flex items-center text-xl font-semibold text-dark dark:text-light">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Chats
      </Link>

      <div className="flex flex-col items-center"> {/* Increased margin top */}
        {user ? (
          <>
            <Link href="/notifications" className="flex items-center text-xl font-semibold text-dark dark:text-light">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Notifications
            </Link>
            <Link href={`/${user.username}`} className="flex items-center text-xl font-semibold text-dark dark:text-light pt-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-3">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              My Profile
            </Link>
          </>
        ) : (
          <div className="flex flex-col space-y-3 items-center"> {/* Increased spacing between items */}
            <Link href="/login" className="text-lg font-semibold text-primary dark:text-light border border-primary dark:border-light px-4 py-2 rounded-md hover:bg-primary hover:text-white dark:hover:bg-light dark:hover:text-primary transition-all duration-300">
              Login
            </Link>
            <Link href="/signup" className="text-lg font-semibold text-white bg-primary px-4 py-2 rounded-md hover:bg-transparent hover:text-primary dark:hover:text-light hover:border hover:border-primary dark:hover:border-light transition-all duration-300">
              Register
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  </motion.div>
)}
    </nav>
  );
}