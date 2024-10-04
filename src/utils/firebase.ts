import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, limit, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, deleteDoc, increment, runTransaction } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase, ref, set, onDisconnect } from 'firebase/database';
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
  oneTimeChatCount?: number;
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
        karma: userDoc.data().karma, // Ensure karma is included
        bio: userDoc.data().bio,
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


const usersSearchingRef = doc(db, 'counters', 'usersSearching');

export async function incrementUsersSearchingCount() {
    await updateDoc(usersSearchingRef, {
        count: increment(1)
    });
}

export async function decrementUsersSearchingCount() {
    const currentCount = await getDoc(usersSearchingRef);
    const count = currentCount.data()?.count || 0;
    if (count > 0) {
        await updateDoc(usersSearchingRef, {
            count: increment(-1)
        });
        console.log('Decremented usersSearching count.');
    } else {
        console.log('UsersSearching count is already 0, not decrementing.');
    }
}

export async function addToMatchingPool(userId: string, karma: number) {
    const userRef = doc(db, 'matchingPool', userId);
    await setDoc(userRef, { uid: userId, karma: karma });
    await incrementUsersSearchingCount();
}

export async function removeFromMatchingPool(userId: string) {
    const userRef = doc(db, 'matchingPool', userId);
    await deleteDoc(userRef);
    await decrementUsersSearchingCount();
}

export async function findMatch(userId: string, karma: number): Promise<ProfileUser | null> {
  const matchPoolRef = collection(db, 'matchingPool');
  const q = query(
    matchPoolRef,
    where('karma', '>=', karma - 100),
    where('karma', '<=', karma + 100),
    limit(1)
  );

  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const match = snapshot.docs[0];
    if (match.id !== userId) {
      // Match found, return user data
      return getUserById(match.id) as Promise<ProfileUser>;
    }
  }
  return null;
}

export async function getOnlineUsersCount(): Promise<number> {
  const users = await getOnlineUsers();
  return users.length;
}

export async function getUsersSearchingCount(): Promise<number> {
  const countDoc = await getDoc(doc(db, 'counters', 'usersSearching'));
  return countDoc.exists() ? countDoc.data().count : 0;
}

export async function updateUsersSearchingCount(change: number): Promise<void> {
  await setDoc(doc(db, 'counters', 'usersSearching'), { count: increment(change) }, { merge: true });
}


export async function setPresence(userId: string): Promise<void> {
    const userStatusDatabaseRef = ref(realtimeDb, `presence/${userId}`);

    const isOfflineForDatabase = {
        state: 'offline',
        lastChanged: serverTimestamp(),
    };

    const isOnlineForDatabase = {
        state: 'online',
        lastChanged: serverTimestamp(),
    };

    try {
        await set(userStatusDatabaseRef, isOnlineForDatabase);

        onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase);
    } catch (error) {
        console.error('Error setting presence:', error);
    }
}

export const getChatById = async (chatId: string): Promise<ChatData | null> => {
    const chatDoc = await getDoc(doc(db, 'chats', chatId));
    if (chatDoc.exists()) {
        return { id: chatDoc.id, ...chatDoc.data() } as ChatData;
    }
    return null;
};

export interface ChatData {
    id: string;
    participants: string[];
    createdAt: Timestamp;
    lastMessageTimestamp: Timestamp;
    // Add other relevant fields here
}

export interface ChatData {
    id: string;
    participants: string[];
    createdAt: Timestamp;
    lastMessageTimestamp: Timestamp;
    // Add other relevant fields here
}

export const startOneTimeChat = async (userId1: string, userId2: string): Promise<string> => {
  return await runTransaction(db, async () => {
    const oneTimeChatsRef = collection(db, 'oneTimeChats');
    const q = query(
      oneTimeChatsRef,
      where('participants', 'array-contains', userId1),
      where('participants', 'array-contains', userId2),
      limit(1)
    );

    const chatSnapshot = await getDocs(q);

    if (!chatSnapshot.empty) {
      // If a one-time chat already exists between the users, return its ID
      return chatSnapshot.docs[0].id;
    }

    // Create a new one-time chat
    const newChatRef = await addDoc(oneTimeChatsRef, {
      participants: [userId1, userId2],
      createdAt: serverTimestamp(),
      lastMessageTimestamp: serverTimestamp(),
      status: 'active',
    });

    return newChatRef.id;
  });
};

export const endOneTimeChat = async (chatId: string): Promise<void> => {
  const chatRef = doc(db, 'oneTimeChats', chatId);
  
  // Optionally, you can archive messages or perform other cleanup here

  await deleteDoc(chatRef);
  console.log(`One-time chat ${chatId} has been deleted.`);
};

// Initialize the usersSearching counter if it doesn't exist
export async function initializeUsersSearchingCounter() {
    const counterDoc = await getDoc(usersSearchingRef);
    if (!counterDoc.exists()) {
        await setDoc(usersSearchingRef, { count: 0 });
        console.log('Initialized usersSearching counter to 0');
    }
}

// Call this function when your app initializes
initializeUsersSearchingCounter().catch(console.error);

export const acceptChatInvitation = async (invitationId: string) => {
  // Implementation of acceptChatInvitation
  // This is a placeholder, you'll need to implement the actual logic
  console.log(`Accepting invitation with ID: ${invitationId}`);
}

export const rejectChatRequest = async (requestId: string): Promise<void> => {
  try {
    const requestRef = doc(db, 'chatRequests', requestId);
    await updateDoc(requestRef, { status: 'rejected' });
  } catch (error) {
    console.error('Error rejecting chat request:', error);
    throw error;
  }
};

// Function to register a new user
export async function registerUser(email: string, password: string, username: string): Promise<void> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      email: user.email,
      username: username,
      bio: '',
      karma: 0,
      createdAt: serverTimestamp(),
    });
    console.log('User registered and data saved:', user);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Function to log in an existing user
export async function loginUser(email: string, password: string): Promise<void> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in:', userCredential.user);
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

// Function to log out the current user
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
    console.log('User logged out');
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
}