"use client";

import React from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const hideNavbarRoutes = ['/login', '/signup'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(pathname);

  // Add this line to conditionally set overflow-y
  const pageStyle = hideNavbarRoutes.includes(pathname) ? 'overflow-y-hidden' : 'overflow-y-auto';

  return (
    <div className={`min-h-screen bg-light ${pageStyle}`}>
      {shouldShowNavbar && <Navbar />}
      <main>
        {children}
      </main>
    </div>
  );
}