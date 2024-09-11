'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserByUsername } from '@/utils/firebase';
import UserProfile from '@/components/UserProfile';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileUser {
  id: string;
  username: string;
  // Add other user properties as needed
}

export default function ProfilePage() {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      if (typeof username === 'string') {
        const user = await getUserByUsername(username);
        if (user) {
          setProfileUser(user as ProfileUser);
        }
      }
    }

    fetchUserData();
  }, [username]);

  if (!profileUser) return <div>Loading...</div>;

  return <UserProfile user={profileUser} currentUser={currentUser} />;
}