'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { acceptChatInvitation, db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ChatInvitationPage() {
  const { invitationId } = useParams();
  const [invitation, setInvitation] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInvitation = async () => {
      if (typeof invitationId === 'string') {
        const invitationDoc = await getDoc(doc(db, 'chatInvitations', invitationId));
        if (invitationDoc.exists()) {
          setInvitation(invitationDoc.data());
        }
      }
    };

    fetchInvitation();
  }, [invitationId]);

  const handleAccept = async () => {
    if (typeof invitationId === 'string') {
      const chatId = await acceptChatInvitation(invitationId);
      router.push(`/chat/${chatId}`);
    }
  };

  const handleDecline = async () => {
    // Implement decline logic
    router.push('/');
  };

  if (!invitation) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Chat Invitation</h1>
        <p className="mb-4">You have been invited to a chat!</p>
        <div className="flex justify-between">
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Accept
          </button>
          <button
            onClick={handleDecline}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}