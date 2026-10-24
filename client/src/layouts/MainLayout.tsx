import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

interface MainLayoutProps {
  cartCount?: number;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ cartCount = 0 }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#080C14] text-slate-100 selection:bg-[#C5A880] selection:text-black">
      <Header cartCount={cartCount} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
