'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LandingPage from '@/components/LandingPage';
import Layout from '@/components/Layout';
import loaderGif from './loader (1).gif';

function HomeContent() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Loading finished");
    }, 0); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {isLoading && (
        <div className="fixed inset-0 h-[100vh] w-[100vw] z-50">
          <Image
            src={loaderGif}
            alt="Loading"
            priority
            className="h-[100vh] w-[100vw]"
          />
        </div>
      )}
      <LandingPage />
    </Layout>
  );
}

export default HomeContent;