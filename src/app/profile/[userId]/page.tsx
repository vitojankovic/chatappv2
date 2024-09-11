'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { auth, db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import UserProfile from '@/components/UserProfile';
import { User } from 'firebase/auth';

export default function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      if (typeof userId === 'string') {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() });
        }
      }
    }

    fetchUserData();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return <UserProfile user={user} currentUser={currentUser} />;
}