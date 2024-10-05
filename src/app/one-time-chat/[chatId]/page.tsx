'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../utils/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, addDoc, serverTimestamp, collection, query, orderBy, increment, Timestamp } from 'firebase/firestore';
import { onDisconnect, set } from 'firebase/database';
import { realtimeDb } from '../../../utils/firebase'; // Make sure to import your realtime database instance
import { ref, onValue } from 'firebase/database';
import Send from './send (2).svg'
import Image from 'next/image'


interface ChatState {
  stage: 'feedback' | 'idea' | 'completed';
  currentUser: string | null; // Allow null for currentUser
  firstUser: string;
  secondUser: string | null;
  endChatProposal: string | null;
  turnCount: number; // Added turnCount property
}

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Timestamp; // Changed 'any' to 'Timestamp'
}

interface User {
  uid: string;
  karma: number;
  lastDisconnect?: Timestamp;
  reportCount?: number;
}

export default function OneTimeChat() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const chatId = params?.chatId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatState, setChatState] = useState<ChatState | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [disconnectedUser, setDisconnectedUser] = useState<string | null>(null);
  const [showCommendModal, setShowCommendModal] = useState(false);

  const isCurrentUserTurn = user && chatState && user.uid === chatState.currentUser;


  useEffect(() => {
    if (!chatId || !user) return;

    const initializeChat = async () => {
      const chatRef = doc(db, 'oneTimeChats', chatId);
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
        // Randomly decide who starts first
        const startsFirst = Math.random() < 0.5 ? 'firstUser' : 'secondUser';
        await setDoc(chatRef, {
          firstUser: user.uid,
          currentUser: startsFirst === 'firstUser' ? user.uid : null,
          stage: 'idea', // Start with idea stage
          secondUser: null,
          endChatProposal: null
        });
        setChatState({
          firstUser: user.uid,
          currentUser: startsFirst === 'firstUser' ? user.uid : null,
          stage: 'idea',
          secondUser: null,
          endChatProposal: null,
          turnCount: 0
        });
        return;
      }

      const chatData = chatDoc.data() as ChatState;

      // Validate that firstUser exists
      if (!chatData.firstUser) {
        // Set firstUser to current user if missing
        await updateDoc(chatRef, { firstUser: user.uid, currentUser: user.uid });
        chatData.firstUser = user.uid;
        chatData.currentUser = user.uid;
      }

      if (!chatData.secondUser && user.uid !== chatData.firstUser) {
        await updateDoc(chatRef, { 
          secondUser: user.uid,
          currentUser: chatData.currentUser || user.uid // Set currentUser if not already set
        });
        chatData.secondUser = user.uid;
        chatData.currentUser = chatData.currentUser || user.uid;
      }

      setChatState(chatData);
      console.log('Chat state initialized:', chatData);

      const unsubscribe = onSnapshot(chatRef, (doc) => {
        const updatedChatState = doc.data() as ChatState;
        setChatState(updatedChatState);
        console.log('Chat state updated:', updatedChatState);
      });

      return () => unsubscribe();
    };

    initializeChat();
  }, [chatId, user]);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, 'oneTimeChats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    console.log('Chat state updated:', chatState);
  }, [chatState]);

  useEffect(() => {
    console.log('Current user:', user);
    console.log('Is current user turn:', isCurrentUserTurn);
  }, [user, isCurrentUserTurn]);

  useEffect(() => {
    if (chatState) {
      console.log('Current chat state:', chatState);
      console.log('Is current user turn:', isCurrentUserTurn);
    }
  }, [chatState, isCurrentUserTurn]);

  useEffect(() => {
    console.log('Current user:', user);
  }, [user]);

  useEffect(() => {
    if (!user || !chatId) return;

    const userStatusRef = ref(realtimeDb, `status/${user.uid}`);
    const disconnectRef = onDisconnect(userStatusRef);

    disconnectRef.set('offline').then(() => {
      set(userStatusRef, 'online');
    });

    return () => {
      disconnectRef.cancel();
    };
  }, [user, chatId]);

  const handleDisconnect = useCallback(async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      lastDisconnect: serverTimestamp()
    });
    setDisconnectedUser(user.uid);
  }, [user]);

  useEffect(() => {
    if (!chatId || !user) return;

    const statusRef = ref(realtimeDb, `status/${user.uid}`);
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      if (status === 'offline') {
        handleDisconnect();
      } else if (status === 'online') {
        setDisconnectedUser(null);
      }
    });

    return () => unsubscribe();
  }, [chatId, user, handleDisconnect]);

  const updateKarma = async (userId: string, amount: number) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      karma: increment(amount)
    });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !chatState || !chatId) return;

    const messagesRef = collection(db, `oneTimeChats/${chatId}/messages`);
    await addDoc(messagesRef, {
      text: newMessage,
      sender: user.uid,
      timestamp: serverTimestamp()
    });
    setNewMessage('');
  };

  const finishTurn = async () => {
    if (!chatState || !chatId || !user) {
      console.error('Missing required data for finishing turn');
      return;
    }

    const chatRef = doc(db, 'oneTimeChats', chatId);
    
    console.log('Current chat state:', chatState);
    console.log('Current user:', user.uid);

    let nextUser: string;
    if (user.uid === chatState.firstUser) {
      if (!chatState.secondUser) {
        // If second user is not set, keep the turn with the first user
        nextUser = chatState.firstUser;
        console.log('Second user not set, keeping turn with first user');
      } else {
        nextUser = chatState.secondUser;
      }
    } else if (user.uid === chatState.secondUser) {
      nextUser = chatState.firstUser;
    } else {
      console.error('Current user is neither firstUser nor secondUser');
      alert('Error finishing turn. User not recognized.');
      return;
    }

    console.log('Determined nextUser:', nextUser);

    const nextStage = chatState.stage === 'feedback' ? 'idea' : 'feedback';
    
    try {
      console.log('Updating chat with:', { currentUser: nextUser, stage: nextStage });
      await updateDoc(chatRef, {
        currentUser: nextUser,
        stage: nextStage
      });
      console.log('Turn finished. Next user:', nextUser, 'Next stage:', nextStage);
    } catch (error) {
      console.error('Error finishing turn:', error);
      alert('Failed to finish turn. Please try again.');
    }
  };

  const proposeEndChat = async () => {
    if (!chatState || !chatId || !user) return;
    const chatRef = doc(db, 'oneTimeChats', chatId);
    await updateDoc(chatRef, { endChatProposal: user.uid });
  };

  const respondToEndChatProposal = async (accept: boolean) => {
    if (!chatState || !chatId) return;
    const chatRef = doc(db, 'oneTimeChats', chatId);
    if (accept) {
      await updateDoc(chatRef, { stage: 'completed' });
      setShowCommendModal(true)
    } else {
      await updateDoc(chatRef, { endChatProposal: null });
    }


  };

  const endChat = async (reportOtherUser: boolean) => {
    if (!chatState || !chatId || !user) return;
    const chatRef = doc(db, 'oneTimeChats', chatId);
    
    await updateDoc(chatRef, { stage: 'completed' });

    // Add karma for completing chat
    await updateKarma(user.uid, 5);
    if (chatState.secondUser) {
      await updateKarma(chatState.secondUser, 5);
    }

    if (reportOtherUser) {
      const otherUserId = user.uid === chatState.firstUser ? chatState.secondUser : chatState.firstUser;
      if (otherUserId) {
        const userRef = doc(db, 'users', otherUserId);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data() as User;
        const karmaDeduction = (userData.reportCount || 0) > 1 ? -20 : -10;
        await updateDoc(userRef, {
          karma: increment(karmaDeduction),
          reportCount: increment(1)
        });
      }
    }

    setShowReportModal(false);
    setShowCommendModal(true);
  };

  const commendUser = async () => {
    if (!chatState || !user) return;
    const otherUserId = user.uid === chatState.firstUser ? chatState.secondUser : chatState.firstUser;
    if (otherUserId) {
      await updateKarma(otherUserId, 3);
    }
    setShowCommendModal(false);
  };

  const leaveChat = async () => {
    if (!chatState || !chatId || !user) return;
    const chatRef = doc(db, 'oneTimeChats', chatId);
    
    await updateDoc(chatRef, { stage: 'completed' });
    await updateKarma(user.uid, -5);

    router.push('/');
  };

  if (!user) return <div>Please sign in to access the chat</div>;
  if (!chatState) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 overflow-y-auto mt-[70px]">
  {chatState && (
    <>
      {/* Message Container */}
      <div className="bg-laccent border-[4px] border-dark rounded-[6px] dark:bg-daccent dark:border-[4px] dark:border-light dark:border-opacity-5 border-opacity-5 p-4 h-[calc(100vh-20rem)] flex flex-col mb-4">
        <p className="mb-4 text-lg">
          {isCurrentUserTurn ? "It's your turn" : "Waiting for the other user"}
          {""}
        </p>
        {!chatState.secondUser && (
          <p className="mb-4 text-yellow-600">Waiting for another user to join...</p>
        )}
        <div className="messages-container flex-grow overflow-y-auto mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 flex ${message.sender === user?.uid ? 'justify-end' : 'justify-start'}`}
            >
              <span
                className={`inline-block p-3 rounded-lg ${
                  message.sender === user?.uid
                    ? 'bg-primarylight text-light'
                    : 'bg-laccent border-[1px] border-[1px] border-dark rounded-[6px] dark:border-[1px] dark:border-light dark:border-opacity-5 border-opacity-5 dark:bg-daccent dark:text-light text-dark'
                }`}
              >
                {message.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Container - Moved outside */}
      <div className="sticky bottom-0">
        <form onSubmit={sendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow border rounded-lg px-4 py-2 mr-2 bg-laccent border-[4px] border-dark dark:bg-daccent dark:border-[4px] dark:border-light border-opacity-5 focus:outline-none focus:ring-2 focus:ring-primary text-lg placeholder-dark dark:placeholder-light h-[60px]"
            placeholder="Write a message..."
            disabled={!isCurrentUserTurn || disconnectedUser !== null}
          />
          <button
            type="submit"
            className="bg-laccent border-[4px] border-dark rounded-[6px] dark:bg-daccent dark:border-[4px] dark:border-light border-opacity-5 p-2 h-[57px] w-[57px] flex items-center justify-center"
          >
            <Image className="dark:invert" src={Send} alt="Send" width={50} height={50} />
          </button>
        </form>
      </div>

      {/* End Chat & Additional Actions */}
      {user && chatState && user.uid === chatState.currentUser && (
        <button
          onClick={finishTurn}
          className="bg-primary text-white px-4 py-2 rounded-[6px] mt-2"
        >
          I'm done with {chatState.stage === 'feedback' ? 'feedback' : 'my idea'}
        </button>
      )}
      {chatState.endChatProposal ? (
        chatState.endChatProposal === user.uid ? (
          <p>Waiting for the other user to accept the end chat proposal...</p>
        ) : (
          <div>
            <p>The other user has proposed to end the chat. Do you accept?</p>
            <button
              onClick={() => respondToEndChatProposal(true)}
              className="bg-primary border-[2px] border-primary text-light px-4 py-2 rounded-[6px] mr-2"
            >
              Accept
            </button>
            <button
              onClick={() => respondToEndChatProposal(false)}
              className="bg-light border-[2px] border-primary text-primary px-4 py-2 rounded-lg"
            >
              Decline
            </button>
          </div>
        )
      ) : (
        <button
          onClick={proposeEndChat}
          className="bg-light border-[2px] border-primary text-primary px-4 py-2 rounded-lg mt-[10px] flex px-4 py-2 mt-2"
        >
          Propose to End Chat
        </button>
      )}

      {chatState.stage === 'completed' ? (
        <div className="text-center mt-4">
          <p className="text-lg">Chat has ended.</p>
          {!showReportModal && (
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg mt-4"
            >
              Report Other User
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={leaveChat}
          className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 ml-[62vw]"
        >
          Leave Chat (-5 Karma)
        </button>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p>Do you want to report the other user? They will lose 10 karma if reported.</p>
            <button
              onClick={() => endChat(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              Yes, Report
            </button>
            <button
              onClick={() => endChat(false)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              No, Don&apos;t Report
            </button>
          </div>
        </div>
      )}

      {showCommendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-md">
            <p>
              Would you like to commend the other user for a positive interaction? They will
              receive 3 karma.
            </p>
            <button
              onClick={commendUser}
              className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
            >
              COMMEND
            </button>
            <button
              onClick={() => {
                setShowCommendModal(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              DON&apos;T COMMEND
            </button>
          </div>
        </div>
      )}
    </>
  )}
</div>

  

  );
}