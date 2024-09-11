import { db } from './firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export async function updateKarma(userId: string, points: number) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    karma: increment(points)
  });
}

export async function penalizeForLeaving(userId: string) {
  await updateKarma(userId, -5); // Deduct 5 karma points for leaving prematurely
}