'use client';

import { useState } from 'react';

interface ChatInterfaceProps {
  currentUser: any; // Replace with actual user type
  onEndChat: () => void;
}

export default function ChatInterface({ currentUser, onEndChat }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement Firebase message sending
      setMessages([...messages, { sender: currentUser.name, text: message }]);
      setMessage('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === currentUser.name ? 'text-right' : 'text-left'}`}>
            <span className="inline-block bg-blue-500 text-white rounded-lg py-2 px-4">
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow mr-2 p-2 rounded-lg border dark:bg-gray-700"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
      <button
        onClick={onEndChat}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        End Chat
      </button>
    </div>
  );
}