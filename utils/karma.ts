import { db } from '../firebase/firebaseConfig';
import { doc, updateDoc, increment } from 'firebase/firestore';

export const updateKarma = async (userId: string, value: number) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    karma: increment(value)
  });
};