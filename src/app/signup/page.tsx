'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import myAnimation from './login-animationtwo.gif';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, username);
      router.push('/profile')
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className=" h-[100vh] w-[100vw] flex flex-col lg:flex-row items-center justify-center min-h-screen overflow-y-hidden signup-page">
      <div className="hidden lg:block w-3/4 h-[100vh]">
          <Image src={myAnimation} className="w-full h-[100vh] object-cover" alt="Login Animation" unoptimized />
      </div>
      <div className="w-full lg:w-1/4 max-w-lg h-[100vh] flex items-center justify-center">
        <div className="w-full flex items-center justify-center h-full">
          <div className="w-full">
            <h1 className="text-3xl font-bold mb-8 text-center">Register</h1>
            <form onSubmit={handleSignup} className="space-y-4 flex flex-col items-center">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-8 bg-[#EAE7E4] border-[1px] border-[#111111] border-opacity-[6.67%] rounded-lg text-xl font-bold placeholder:font-bold placeholder:text-xl"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-8 bg-[#EAE7E4] border-[1px] border-[#111111] border-opacity-[6.67%] rounded-lg text-xl font-bold placeholder:font-bold placeholder:text-xl"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-8 bg-[#EAE7E4] border-[1px] border-[#111111] border-opacity-[6.67%] rounded-lg text-xl font-bold placeholder:font-bold placeholder:text-xl"
              />
              <button type="submit" className="w-full bg-[#1E1E7C] text-white p-3 rounded-lg font-bold hover:bg-dark hover:text-white transition-all duration-500">Register</button>
              <button type="button" onClick={() => router.push('/login')} className="w-full bg-white text-[#1E1E7C] p-3 rounded-lg font-bold border-2 border-[#1E1E7C] hover:bg-[#1E1E7C] hover:text-white transition-all duration-500">Login Instead</button>
            </form>
            {error && <p className="text-red-500 mt-4 text-center font-bold">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}