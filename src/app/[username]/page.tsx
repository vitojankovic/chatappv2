'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { db, getOrCreateDirectChat, getUserByUsername } from '../../utils/firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/firebase';

function getRandomColor(name: string | undefined) {
  if (!name) return '#000000';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.floor(Math.abs((Math.sin(hash) * 16777215) % 1) * 16777215).toString(16);
  return '#' + '0'.repeat(6 - color.length) + color;
}

export default function ProfilePage() {
  const { user, loading: authLoading, updateUserProfile } = useAuth();
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const username = params?.username;
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [profileUser, setProfileUser] = useState<any>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const fetchProfileUser = async () => {
      setLoading(true);
      try {
        if (username) {
          const profileUserData = await getUserByUsername(username);
          if (profileUserData) {
            setProfileUser(profileUserData);
            setBio(profileUserData.bio || '');
          } else {
            setProfileUser(null);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchProfileUser();
    }

  }, [username]);

  const isOwnProfile = user && profileUser && user.username === profileUser.username;

  if (authLoading || loading) {
    return <div className="text-primary dark:text-primarylight text-center">Loading...</div>;
  }

  if (!profileUser) {
    return <div className="text-primary dark:text-primarylight text-center">User not found</div>;
  }

  const avatarColor = getRandomColor(profileUser.username);
  const initial = profileUser.username ? profileUser.username.charAt(0).toUpperCase() : '?';

  const handleSaveBio = async () => {
    if (isOwnProfile && user) {
      try {
        await updateUserProfile({ bio });
        setProfileUser((prevUser: any) => ({ ...prevUser, bio }));
        setIsEditing(false);
        setUpdateError(null);
      } catch (error) {
        console.error('Failed to update bio:', error);
        setUpdateError('Failed to update bio. Please try again.');
      }
    }
  };

  const handleRequestOneTimeChat = () => {
    if (!user || !profileUser) return;
    router.push(`/one-time-chat-request/${profileUser.id}`);
  };

  const handleDirectMessage = async () => {
    if (!user || !profileUser || user.uid === profileUser.id) {
      alert('Invalid user or you cannot message yourself.');
      return;
    }

    setRequestLoading(true);
    try {
      const chatId = await getOrCreateDirectChat(user.uid, profileUser.id);
      router.push(`/chats/${chatId}`);
    } catch (error) {
      alert('Failed to start direct message. Please try again.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[100px]">
      <div className="bg-laccent dark:bg-daccent shadow-md dark:shadow-darkshadow rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mr-4"
            style={{ backgroundColor: avatarColor }}
          >
            {initial}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary dark:text-primarylight">{profileUser.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">@{profileUser.username}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2 text-primary dark:text-primarylight">Bio</h2>
          {isEditing ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded bg-light dark:bg-dark"
              />
              <button onClick={handleSaveBio} className="mt-2 bg-primary text-white px-4 py-2 rounded">Save</button>
              {updateError && <p className="text-errorcolor mt-2">{updateError}</p>}
            </>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300">{profileUser.bio || 'No bio provided.'}</p>
              {isOwnProfile && (
                <button onClick={() => setIsEditing(true)} className="mt-2 text-primary dark:text-primarylight underline">Edit Bio</button>
              )}
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary p-4 rounded-md shadow-lightshadow dark:shadow-darkshadow">
            <h3 className="text-light font-semibold mb-1">Karma</h3>
            <p className="text-2xl font-bold text-light">{user?.karma ?? 0}</p>
          </div>
          <div className="bg-light dark:bg-dark p-4 rounded-md shadow-lightshadow dark:shadow-darkshadow">
            <h3 className="text-primary dark:text-primarylight font-semibold mb-1">One-Time Chats</h3>
            <p className="text-2xl font-bold text-primary dark:text-primarylight">{profileUser.oneTimeChatCount || 0}</p>
          </div>
        </div>
        {!isOwnProfile && (
          <div className="mt-6 space-y-2">
            <button
              onClick={handleRequestOneTimeChat}
              className="w-full bg-successcolor text-white px-4 py-2 rounded hover:bg-green-600 transition-all duration-300 shadow-lightshadow dark:shadow-none"
            >
              Request One-Time Chat
            </button>
            <button
              onClick={handleDirectMessage}
              className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primarylight transition-all duration-300 shadow-lightshadow dark:shadow-none"
            >
              Direct Message
            </button>
          </div>
        )}
        {isOwnProfile && (
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="w-full bg-errorcolor text-white px-4 py-2 rounded hover:bg-red-600 transition-all duration-300 shadow-lightshadow dark:shadow-none"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
