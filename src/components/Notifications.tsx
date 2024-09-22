'use client';

import { useState, useEffect } from 'react';
import { auth, db, acceptChatRequest } from '@/utils/firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  type: string;
  senderId: string;
  message: string;
  createdAt: Timestamp;
  chatRequestId: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const notificationsRef = collection(db, 'users', auth.currentUser.uid, 'notifications');
    const q = query(notificationsRef, where('read', '==', false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, []);

  const handleAcceptRequest = async (notification: Notification) => {
    try {
      console.log('Accepting chat request:', notification);
      if (!notification.id) {
        console.error('Notification ID is undefined');
        throw new Error('Notification ID is undefined');
      }
      const chatId = await acceptChatRequest(notification.id);
      console.log('Chat request accepted, chatId:', chatId);
      router.push(`/one-time-chat/${chatId}`);
    } catch (error) {
      console.error('Error accepting chat request:', error);
      alert('Failed to accept chat request. Please try again.');
    }
  };

  return (
    <div className="bg-red-500">
      <h2>Notifications</h2>
      {notifications.map(notification => (
        <div key={notification.id}>
          <p>{notification.message}</p>
          {notification.type === 'chat_request' && (
            <button onClick={() => handleAcceptRequest(notification)}>
              N
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Notifications;