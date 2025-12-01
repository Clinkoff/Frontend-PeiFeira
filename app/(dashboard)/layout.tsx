'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ClientOnly } from '@/components/layout/ClientOnly';
import { NotificationProvider } from '@/lib/contexts/NotificationContext';
import { NotificationToast } from '@/components/shared/NotificationToast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  console.log('🔍 Layout renderizado');
  console.log('🔍 Sidebar open:', sidebarOpen);

  return (
    <ClientOnly>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-background">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <div className="lg:pl-64">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <main className="p-4 lg:p-6">{children}</main>
          </div>
        </div>
        <NotificationToast />
      </NotificationProvider>
    </ClientOnly>
  );
}
