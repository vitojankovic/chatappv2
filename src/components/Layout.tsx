"use client";

import React from 'react';
import Navbar from './Navbar';
import { ThemeProvider } from 'next-themes';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider attribute="class">
      <div className=" bg-light dark:bg-dark transition-colors duration-800 ease-out">
        <Navbar />
        {children}
      </div>
    </ThemeProvider>
  );
}