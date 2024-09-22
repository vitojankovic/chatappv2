import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ChatNavbarProps {
  username: string;
  imageUrl: string;
}

const ChatNavbar: React.FC<ChatNavbarProps> = ({ username, imageUrl }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBack = useCallback(() => {
    if (isMounted) {
      router.push('/chats');
    }
  }, [router, isMounted]);

  if (!isMounted) {
    return null; // Render nothing until mounted
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-primary text-white p-4 md:hidden">
      <div className="flex items-center">
        <button onClick={handleBack} className="mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <Image src={imageUrl} alt={username} width={32} height={32} className="rounded-full mr-2" />
        <span className="font-semibold">{username}</span>
      </div>
    </nav>
  );
};

export default ChatNavbar;