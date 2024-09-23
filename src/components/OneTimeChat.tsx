import { getOnlineUsers } from '@/utils/firebase';
import { useEffect, useState } from 'react';

// Define the Chat type
type Chat = {
  id: string;
  username: string;
  // Add other properties as needed
};

export default function OneTimeChat() {
  // ... existing state ...
  const [onlineUsers, setOnlineUsers] = useState<Chat[]>([]);
  useEffect(() => {
    // ... existing useEffect ...

    // Fetch online users
    const fetchOnlineUsers = async () => {
      const users = await getOnlineUsers();
      setOnlineUsers(users);
    };

    fetchOnlineUsers();

    const interval = setInterval(fetchOnlineUsers, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []); // Remove 'user' from here

  return (
    <div className="container mx-auto p-4">
      {/* ... existing UI ... */}
      <h2 className="text-xl font-semibold mt-6">Online Users</h2>
      <ul>
        {onlineUsers.map(u => (
          <li key={u.id}>{u.username}</li>
        ))}
      </ul>
    </div>
  );
}