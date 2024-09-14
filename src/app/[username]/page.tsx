'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { db, getOrCreateDirectChat, getUserByUsername } from '../../utils/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
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

  useEffect(() => {
    console.log('User state in component:', user);
    console.log('Auth loading state:', authLoading);
  }, [user, authLoading]);

  const isOwnProfile = user && profileUser && user.username === profileUser.username;

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!profileUser) {
    return <div>User not found</div>;
  }

  const avatarColor = getRandomColor(profileUser.name);
  const initial = profileUser.name ? profileUser.name.charAt(0).toUpperCase() : '?';

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
    console.log('handleDirectMessage called');
    console.log('Current user:', user);
    console.log('Profile user:', profileUser);

    if (loading) {
      console.log('Auth state is still loading');
      return;
    }

    if (!user) {
      console.error('User is not logged in');
      alert('Please log in to start a direct message.');
      return;
    }

    if (!profileUser || !profileUser.id) {
      console.error('Profile user data is missing or incomplete');
      alert('Unable to start chat. Profile data is missing or incomplete.');
      return;
    }

    if (user.uid === profileUser.id) {
      console.log('Cannot start a chat with yourself');
      alert('You cannot start a direct message with yourself.');
      return;
    }

    setRequestLoading(true);
    try {
      const chatId = await getOrCreateDirectChat(user.uid, profileUser.id);
      console.log('Chat document created or retrieved:', chatId);
      router.push(`/chats/${chatId}`);
    } catch (error) {
      console.error('Error starting direct message:', error);
      alert('Failed to start direct message. Please try again.');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-[100px]">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white mr-4"
            style={{ backgroundColor: avatarColor }}
          >
            {initial}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profileUser.name}</h1>
            <p className="text-gray-600">@{profileUser.username}</p>
          </div>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Bio</h2>
          {isEditing ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button onClick={handleSaveBio} className="mt-2 bg-blue-500 text-white px-2 rounded">Save</button>
              {updateError && <p className="text-red-500 mt-2">{updateError}</p>}
            </>
          ) : (
            <>
              <p className="text-gray-700">{profileUser.bio || 'No bio provided.'}</p>
              {isOwnProfile && (
                <button onClick={() => setIsEditing(true)} className="mt-2 text-blue-500">Edit Bio</button>
              )}
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-1">Karma</h3>
            <p className="text-2xl font-bold">{user?.karma ?? 0}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-1">One-Time Chats</h3>
            <p className="text-2xl font-bold">{profileUser.oneTimeChatCount || 0}</p>
          </div>
        </div>
        {!isOwnProfile && (
          <div className="mt-4 space-x-2">
            <button 
              onClick={handleRequestOneTimeChat}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Request One-Time Chat
            </button>
            <button 
              onClick={handleDirectMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Direct Message
            </button>
          </div>
        )}
        {isOwnProfile && (
          <div className="mt-4">
            <button 
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}