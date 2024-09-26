import ChatList from '@/components/ChatList';
import DirectChatPage from '@/components/DirectChatPage';

export async function generateStaticParams() {
  // For now, return an empty array or implement fetchChatIds()
  return [];
  // const chatIds = await fetchChatIds();
  // return chatIds.map((id) => ({ chatId: id }));
}

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-background dark:bg-background-dark">
      <ChatList />
      <div className="w-full sm:w-2/3 h-screen">
        <DirectChatPage />
      </div>
    </div>
  );
}
