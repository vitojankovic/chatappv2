'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { getOrCreateDirectChat, getUserByUsername, ProfileUser as FirebaseProfileUser } from '../../utils/firebase';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/firebase';

// Update the local interface to extend the Firebase one
interface ProfileUser extends FirebaseProfileUser {
  name: string;
}

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
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null);
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
            setProfileUser(profileUserData as ProfileUser);
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
        setProfileUser((prevUser: ProfileUser | null) => prevUser ? { ...prevUser, bio } : null);
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
<div className="container mx-auto px-4 py-8 my-auto mt-[80px]">
  <div className="bg-laccent border-[4px] border-dark rounded-[6px] dark:bg-daccent dark:border-[4px] dark:border-light dark:border-opacity-5 border-opacity-5 p-6">
    <div className="flex flex-col justify-center items-center text-center">
      <div
        className="w-[100px] h-[100px] rounded-[8px] flex items-center justify-center text-3xl font-bold text-white mb-4 mt-8"
        style={{ backgroundColor: avatarColor }}
      >
        {initial}
      </div>
      <div>
        {/* Username should stand out */}
        <p className="text-primary dark:text-primary text-2xl md:text-4xl font-bold">
          {profileUser.username}
        </p>
      </div>
    </div>

    <div className="mt-6">
      <h2 className="text-lg md:text-xl font-semibold mb-2 text-primary dark:text-primarylight">
        Bio
      </h2>
      {isEditing ? (
        <>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 border rounded-[8px] bg-light dark:bg-dark text-black dark:text-white"
          />
          <button
            onClick={handleSaveBio}
            className="mt-2 bg-primary text-white px-4 py-2 text-base md:text-lg rounded-[8px] hover:bg-primarylight"
          >
            Save
          </button>
          {updateError && <p className="text-errorcolor mt-2">{updateError}</p>}
        </>
      ) : (
        <>
          {/* Bio text, should be readable but not too large */}
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
            {profileUser.bio || 'No bio provided.'}
          </p>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 text-primary dark:text-primarylight underline text-sm md:text-base"
            >
              Edit Bio
            </button>
          )}
        </>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div className="bg-primary p-4 rounded-[8px] shadow-lightshadow dark:shadow-darkshadow">
        <h3 className="text-light font-semibold mb-1 text-lg">Karma</h3>
        {/* Karma score should be large to emphasize importance */}
        <p className="text-3xl font-bold text-light">{user?.karma ?? 0}</p>
      </div>

      <div className="bg-light dark:bg-dark p-4 rounded-[8px] shadow-lightshadow dark:shadow-darkshadow">
        <h3 className="text-primary dark:text-primarylight font-semibold mb-1 text-lg">
          One-Time Chats
        </h3>
        <p className="text-3xl font-bold text-primary dark:text-primarylight">
          {profileUser.oneTimeChatCount || 0}
        </p>
      </div>
    </div>

    {!isOwnProfile && (
      <div className="mt-6 space-y-2">
        <button
          onClick={handleRequestOneTimeChat}
          className="w-full bg-successcolor text-white px-4 py-2 text-base md:text-lg rounded-[8px] hover:bg-green-600 transition-all duration-300"
        >
          Request One-Time Chat
        </button>
        <button
          onClick={handleDirectMessage}
          disabled={requestLoading}
          className={`w-full bg-primary text-white px-4 py-2 text-base md:text-lg rounded-[8px] hover:bg-primarylight transition-all duration-300 ${
            requestLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {requestLoading ? 'Loading...' : 'Direct Message'}
        </button>
      </div>
    )}

    {isOwnProfile && (
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleLogout}
          className="w-[80%] max-w-[500px] ml-auto mr-auto bg-errorcolor text-white px-4 py-2 text-base md:text-lg rounded-[8px] hover:bg-red-600 transition-all duration-300"
        >
          Log Out
        </button>
      </div>
    )}
  </div>
</div>
  );
}
