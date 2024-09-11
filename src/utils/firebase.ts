import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  limit, 
  serverTimestamp, 
  doc, 
  setDoc, 
  arrayUnion, 
  deleteDoc,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

console.log('Firebase Config:', firebaseConfig);

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
export const db = getFirestore(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
    } else if (err.code == 'unimplemented') {
      console.log('The current browser does not support all of the features required to enable persistence');
    }
  });
}

export const createUserProfile = async (userId: string, username: string, email: string, bio: string) => {
  await setDoc(doc(db, 'users', userId), {
    username,
    email,
    bio,
    karma: 100, // Starting karma
    createdAt: serverTimestamp(),
  });
};

// Add this new function to add a user to the matching pool
export const addToMatchingPool = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  const userKarma = userDoc.data()?.karma || 0;

  await setDoc(doc(db, 'matchingPool', userId), {
    userId,
    karma: userKarma,
    timestamp: serverTimestamp(),
  });
};

// Update the findMatch function
export const findMatch = async () => {
  const user = ensureAuth();
  const currentUserId = user.uid;
  try {
    // Get the current user's karma
    const currentUserDoc = await getDoc(doc(db, 'users', currentUserId));
    const currentUserKarma = currentUserDoc.data()?.karma || 0;

    const matchingPoolRef = collection(db, 'matchingPool');
    const q = query(
      matchingPoolRef,
      where('userId', '!=', currentUserId),
      orderBy('karma')
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      let closestMatch = null;
      let smallestKarmaDifference = Infinity;

      for (const doc of querySnapshot.docs) {
        const potentialMatchKarma = doc.data().karma;
        const karmaDifference = Math.abs(currentUserKarma - potentialMatchKarma);

        if (karmaDifference < smallestKarmaDifference) {
          smallestKarmaDifference = karmaDifference;
          closestMatch = doc;
        }
      }

      if (closestMatch) {
        const matchedUserId = closestMatch.data().userId;
        
        // Create a new chat
        const chatId = await createChat(currentUserId, matchedUserId, 'persistent'); // Add 'true' for isLive
        
        // Remove both users from the matching pool
        await removeFromMatchingPool(currentUserId);
        await removeFromMatchingPool(matchedUserId);
        
        // Update both users' documents to add the chat reference
        await updateDoc(doc(db, 'users', currentUserId), {
          currentChat: chatId
        });
        
        await updateDoc(doc(db, 'users', matchedUserId), {
          currentChat: chatId
        });
        
        return { matchedUserId, chatId };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error in findMatch:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
};

// Update the makeUserAvailable function (we'll rename it to removeFromMatchingPool)
export const removeFromMatchingPool = async (userId: string) => {
  await deleteDoc(doc(db, 'matchingPool', userId));
};

export const createChat = async (user1Id: string, user2Id: string, chatType: 'persistent' | 'oneTime') => {
  const chatData: any = {
    participants: [user1Id, user2Id],
    messages: [],
    chatType,
    createdAt: serverTimestamp(),
  };

  if (chatType === 'oneTime') {
    const coinFlip = Math.random() < 0.5;
    chatData.currentTurn = coinFlip ? user1Id : user2Id;
    chatData.phase = 'initial';
  }

  const chatRef = await addDoc(collection(db, 'chats'), chatData);
  return chatRef.id;
};

// Export the makeUserAvailable function
export const makeUserAvailable = async (userId: string) => {
  await updateDoc(doc(db, 'users', userId), {
    isAvailable: true,
    currentChat: null
  });
};

export const sendMessage = async (chatId: string, userId: string, content: string) => {
  const chatRef = doc(db, 'chats', chatId);
  const chatDoc = await getDoc(chatRef);

  if (!chatDoc.exists()) throw new Error('Chat not found');

  const chatData = chatDoc.data();
  if (chatData.chatType === 'oneTime' && chatData.currentTurn !== userId) {
    throw new Error('Not your turn');
  }

  const messageData = {
    sender: userId,
    content,
    timestamp: new Date().toISOString(),
  };

  await updateDoc(chatRef, {
    messages: arrayUnion(messageData),
  });
};

export const flipCoin = async (chatId: string) => {
  const result = Math.random() < 0.5;
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    coinFlipResult: result ? 'Heads' : 'Tails',
  });
  return result;
};

export const endChat = async (chatId: string, userId: string) => {
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    [`endRequests.${userId}`]: true
  });
};

export const acceptEndChat = async (chatId: string) => {
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    status: 'ended'
  });
};

// Add this to the top of your functions
const ensureAuth = () => {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error("User not authenticated");
  }
  return auth.currentUser;
};

// Add similar checks to other functions that require authentication

export const requestChat = async (targetUserId: string) => {
  const user = ensureAuth();
  const currentUserId = user.uid;

  const chatRequestRef = doc(db, 'chatRequests', `${currentUserId}_${targetUserId}`);
  await setDoc(chatRequestRef, {
    from: currentUserId,
    to: targetUserId,
    status: 'pending',
    timestamp: serverTimestamp(),
  });
};

export const getUserOnlineStatus = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.data()?.isOnline || false;
};

export const acceptChatRequest = async (requestId: string) => {
  const user = ensureAuth();
  const currentUserId = user.uid;

  const chatRequestRef = doc(db, 'chatRequests', requestId);
  const chatRequestDoc = await getDoc(chatRequestRef);

  if (!chatRequestDoc.exists() || chatRequestDoc.data().recipientId !== currentUserId) {
    throw new Error('Invalid chat request');
  }

  const request = chatRequestDoc.data();
  const chatId = await createChat(request.senderId, currentUserId, request.chatType);

  await updateDoc(chatRequestRef, { status: 'accepted', chatId });
  await deleteDoc(chatRequestRef);

  return chatId;
};

export const rejectChatRequest = async (requestId: string) => {
  const user = ensureAuth();
  const currentUserId = user.uid;

  const chatRequestRef = doc(db, 'chatRequests', requestId);
  const chatRequestDoc = await getDoc(chatRequestRef);

  if (!chatRequestDoc.exists() || chatRequestDoc.data().recipientId !== currentUserId) {
    throw new Error('Invalid chat request');
  }

  await deleteDoc(chatRequestRef);
};

export const sendChatInvitation = async (senderId: string, recipientId: string) => {
  try {
    const invitationRef = await addDoc(collection(db, 'chatInvitations'), {
      senderId,
      recipientId,
      status: 'pending',
      timestamp: serverTimestamp(),
    });

    await addDoc(collection(db, 'notifications'), {
      type: 'invitation',
      senderId,
      recipientId,
      invitationId: invitationRef.id,
      message: 'You have a new chat invitation',
      timestamp: serverTimestamp(),
    });

    return invitationRef.id;
  } catch (error) {
    console.error('Error sending chat invitation:', error);
    throw new Error('Failed to send chat invitation. Please try again.');
  }
};

export const acceptChatInvitation = async (invitationId: string) => {
  const user = ensureAuth();
  const invitationRef = doc(db, 'notifications', invitationId);
  const invitationDoc = await getDoc(invitationRef);

  if (!invitationDoc.exists()) {
    throw new Error('Invitation not found');
  }

  const invitation = invitationDoc.data();
  const chatId = await createChat(invitation.senderId, user.uid);

  await updateDoc(invitationRef, { status: 'accepted', chatId });
  await deleteDoc(invitationRef);

  return chatId;
};

export async function getUserById(userId: string) {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
}

export async function getUserByUsername(username: string) {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('username', '==', username), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
}

export const createChatRequest = async (senderId: string, recipientId: string, chatType: 'persistent' | 'oneTime') => {
  const chatRequestRef = await addDoc(collection(db, 'chatRequests'), {
    senderId,
    recipientId,
    chatType,
    status: 'pending',
    timestamp: serverTimestamp(),
  });
  return chatRequestRef.id;
};