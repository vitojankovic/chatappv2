import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export const sendMessage = async (chatId: string, message: string, userId: string) => {
  try {
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: message,
      createdAt: new Date(),
      userId: userId
    });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};

// ... other firebase-related utility functions ...