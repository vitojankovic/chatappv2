import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, limit, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Ensure Firebase is initialized only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
export const realtimeDb = getDatabase(app);

export { app, db, auth };

export interface ProfileUser {
  id: string;
  username: string;
  bio?: string;
  karma: number; // Ensure this field is present
  // Add other relevant fields here
}

export async function getUserByUsername(username: string): Promise<ProfileUser | null> {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username));
  
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return {
        id: userDoc.id,
        username: userDoc.data().username,
        // Add other relevant fields here
      } as ProfileUser;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

export const sendChatRequest = async (senderId: string, receiverId: string, type: 'oneTime' | 'direct') => {
  try {
    // Create a chat request
    const chatRequestRef = await addDoc(collection(db, 'chatRequests'), {
      senderId,
      receiverId,
      type,
      status: 'pending',
      createdAt: serverTimestamp()
    });

    // Create a notification for the receiver
    await createNotification(receiverId, 'chatRequest', senderId, chatRequestRef.id);

    console.log('Chat request sent and notification created');
    return chatRequestRef.id;
  } catch (error) {
    console.error('Error sending chat request:', error);
    throw error;
  }
};

export const startDirectMessage = async (currentUserId: string, targetUserId: string) => {
  const chatRef = collection(db, 'chats');
  const q = query(
    chatRef,
    where('participants', 'array-contains', currentUserId)
  );

  const existingChats = await getDocs(q);
  const existingChat = existingChats.docs.find(doc => 
    doc.data().participants.includes(targetUserId)
  );

  if (existingChat) {
    return existingChat.id;
  }

  // Create new chat
  const newChatRef = await addDoc(chatRef, {
    participants: [currentUserId, targetUserId],
    createdAt: serverTimestamp(),
    lastMessageTimestamp: serverTimestamp()
  });

  return newChatRef.id;
};

export const acceptChatRequest = async (notificationId: string) => {
  if (!auth.currentUser) throw new Error('User not authenticated');

  console.log('Accepting chat request for notification:', notificationId);

  const notificationRef = doc(db, 'users', auth.currentUser.uid, 'notifications', notificationId);
  const notificationSnap = await getDoc(notificationRef);

  if (!notificationSnap.exists()) {
    console.error('Notification not found:', notificationId);
    throw new Error('Notification not found');
  }

  const notificationData = notificationSnap.data();
  console.log('Notification data:', notificationData);

  const chatRequestId = notificationData.chatRequestId;
  if (!chatRequestId) {
    console.error('Chat request ID not found in notification data');
    throw new Error('Chat request ID not found');
  }

  const chatRequestRef = doc(db, 'chatRequests', chatRequestId);
  const chatRequestSnap = await getDoc(chatRequestRef);

  if (!chatRequestSnap.exists()) {
    console.error('Chat request not found:', chatRequestId);
    throw new Error('Chat request not found');
  }

  const chatRequestData = chatRequestSnap.data();
  console.log('Chat request data:', chatRequestData);
  
  // Create a new one-time chat
  const oneTimeChatRef = await addDoc(collection(db, 'oneTimeChats'), {
    participants: [chatRequestData.senderId, chatRequestData.receiverId],
    createdAt: serverTimestamp(),
    status: 'active'
  });

  console.log('One-time chat created:', oneTimeChatRef.id);

  // Update the chat request status
  await updateDoc(chatRequestRef, { status: 'accepted' });

  // Delete the notification
  await deleteDoc(notificationRef);

  return oneTimeChatRef.id;
};

export const getOrCreateDirectChat = async (userId1: string, userId2: string) => {
  const chatQuery = query(
    collection(db, 'chats'),
    where('participants', 'in', [[userId1, userId2], [userId2, userId1]])
  );

  const chatSnapshot = await getDocs(chatQuery);

  if (!chatSnapshot.empty) {
    return chatSnapshot.docs[0].id;
  }

  // Check if both users exist
  const user1Doc = await getDoc(doc(db, 'users', userId1));
  const user2Doc = await getDoc(doc(db, 'users', userId2));

  if (!user1Doc.exists() || !user2Doc.exists()) {
    throw new Error('One or both users not found');
  }

  const newChatRef = await addDoc(collection(db, 'chats'), {
    participants: [userId1, userId2],
    createdAt: serverTimestamp(),
  });

  return newChatRef.id;
};

export const getUsernameById = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data().username;
  }
  throw new Error('User not found');
};

export const getUserChats = async (userId: string) => {
  const chatsRef = collection(db, 'chats');
  const q = query(chatsRef, where('participants', 'array-contains', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getUserById = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

async function createNotification(userId: string, type: string, senderId: string, chatRequestId: string) {
  try {
    console.log('Creating notification:', { userId, type, senderId, chatRequestId });
    const notificationRef = doc(db, 'users', userId, 'notifications', chatRequestId);
    const senderDoc = await getDoc(doc(db, 'users', senderId));
    const senderData = senderDoc.data();
    const senderUsername = senderData?.username || 'A user';

    const notificationData = {
      type,
      senderId,
      chatRequestId,
      message: `${senderUsername} sent you a chat request`,
      createdAt: serverTimestamp(),
      read: false,
    };
    console.log('Notification data:', notificationData);

    await setDoc(notificationRef, notificationData);
    console.log('Notification created successfully, docId:', notificationRef.id);
    return notificationRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export const getOnlineUsers = async (): Promise<ProfileUser[]> => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const q = query(
    collection(db, 'users'),
    where('lastActive', '>=', Timestamp.fromDate(fiveMinutesAgo))
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    username: doc.data().username,
    karma: doc.data().karma,
    bio: doc.data().bio,
    // Include other fields as needed
  })) as ProfileUser[];
};

console.log('Firebase config:', firebaseConfig);