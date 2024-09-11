'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import ChatRequest from './ChatRequest';

interface Notification {
  id: string;
  type: string;
  senderId: string;
  senderName: string;
  chatType: 'persistent' | 'oneTime';
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'chatRequests'), where('recipientId', '==', user.uid), where('status', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notifs: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notifs.push({
          id: doc.id,
          type: 'chatRequest',
          senderId: data.senderId,
          senderName: data.senderName,
          chatType: data.chatType,
        });
      });
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id}>
              {notification.type === 'chatRequest' && (
                <ChatRequest
                  requestId={notification.id}
                  senderName={notification.senderName}
                  chatType={notification.chatType}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}