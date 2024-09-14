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

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id} className="bg-white shadow-md rounded-lg p-4">
              <p>{notification.message}</p>
              <button 
                onClick={() => handleAccept(notification.id)}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
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