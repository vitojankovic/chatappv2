import { db } from './firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export const createUserProfile = (userId: string, username: string, bio: string) => {
  return setDoc(doc(db, 'users', userId), { username, bio, karma: 0 });
};

export const getUserProfile = (userId: string) => {
  return getDoc(doc(db, 'users', userId));
};

export const updateUserProfile = (userId: string, data: any) => {
  return updateDoc(doc(db, 'users', userId), data);
};