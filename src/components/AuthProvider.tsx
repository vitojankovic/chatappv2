'use client';

import { useEffect } from 'react';
import { auth } from '@/utils/firebase';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user ? 'User is signed in' : 'User is signed out');
    });

    return () => unsubscribe();
  }, []);

  return <>{children}</>;
}