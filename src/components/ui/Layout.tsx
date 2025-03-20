
import React from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children,
  showSidebar = true,
  className
}) => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <div className="flex flex-grow overflow-hidden">
        {showSidebar && <Sidebar />}
        <main className={cn(
          "flex-grow p-4 md:p-6 overflow-auto transition-all duration-300",
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};
