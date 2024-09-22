'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, acceptChatRequest } from '../../utils/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: string;
  senderId: string;
  chatRequestId: string;
  message: string;
  createdAt: Timestamp;
  read: boolean;
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    console.log('Setting up notifications listener for user:', user.uid);

    const notificationsRef = collection(db, 'users', user.uid, 'notifications');
    const q = query(notificationsRef, where('read', '==', false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Notifications snapshot received:', snapshot.docs.length, 'notifications');
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
      setNotifications(newNotifications);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAccept = async (notificationId: string) => {
    try {
      const chatId = await acceptChatRequest(notificationId);
      router.push(`/one-time-chat/${chatId}`);
    } catch (error) {
      console.error('Error accepting chat request:', error);
      setError('Failed to accept chat request');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-primary">Loading notifications...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-errorcolor">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-[100px] max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-primary">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-center text-daccent">No new notifications</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id} className="bg-light dark:bg-dark shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-lg">
              <p className="text-daccent dark:text-laccent mb-4">{notification.message}</p>
              <button 
                onClick={() => handleAccept(notification.id)}
                className="w-full bg-primary hover:bg-primarylight text-light font-semibold py-2 px-4 rounded transition-colors duration-300"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}