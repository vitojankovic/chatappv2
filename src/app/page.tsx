'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import LandingPage from '@/components/LandingPage';
import Layout from '@/components/Layout';
import loaderGif from './loader (1).gif';

function HomeContent() {
  /*const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      console.log("Loading finished");
    }, 0); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);*/

  return (
    <Layout>
      <LandingPage />
    </Layout>
  );
}

export default HomeContent;