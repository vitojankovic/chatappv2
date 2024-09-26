import { acceptChatInvitation, db } from '@/utils/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function generateStaticParams() {
  // For now, return an empty array or implement fetchInvitationIds()
  return [];
  // const invitationIds = await fetchInvitationIds();
  // return invitationIds.map((id) => ({ invitationId: id }));
}

export default async function ChatInvitationPage({ params }: { params: { invitationId: string } }) {
  const { invitationId } = params;
  const invitationDoc = await getDoc(doc(db, 'chatInvitations', invitationId));
  const invitation = invitationDoc.exists() ? invitationDoc.data() : null;

  if (!invitation) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Chat Invitation</h1>
        <p className="mb-4">You have been invited to a chat!</p>
        <div className="flex justify-between">
          <form action={async () => {
            'use server';
            const chatId = await acceptChatInvitation(invitationId);
            // Redirect to the chat page
          }}>
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
              Accept
            </button>
          </form>
          <form action={async () => {
            'use server';
            // Implement decline logic
            // Redirect to home page
          }}>
            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
              Decline
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}