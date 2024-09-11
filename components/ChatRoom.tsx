import React, { useState, useEffect } from 'react';
import { rtdb } from '../firebase/firebaseConfig';
import { ref, push, onChildAdded } from 'firebase/database';
import { performCoinFlip } from '../utils/coinFlip';

function ChatRoom({ user1, user2 }) {
  const [messages, setMessages] = useState([]);
  const [coinFlipResult, setCoinFlipResult] = useState(null);

  useEffect(() => {
    const result = performCoinFlip();
    setCoinFlipResult(result);
    
    const chatRef = ref(rtdb, `chats/${user1.id}_${user2.id}`);
    const unsubscribe = onChildAdded(chatRef, (snapshot) => {
      setMessages((prev) => [...prev, snapshot.val()]);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = (text) => {
    const chatRef = ref(rtdb, `chats/${user1.id}_${user2.id}`);
    push(chatRef, { sender: user1.id, text });
  };

  return (
    <div>
      <p>{coinFlipResult === 'heads' ? user1.username : user2.username} starts the chat</p>
      {/* Render messages and input field */}
    </div>
  );
}

export default ChatRoom;1