// components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getVisibleNavItems } from '@/lib/utils/navigation';
import { GraduationCap, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const navItems = getVisibleNavItems(user?.tipo);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <>
      {isOpen && onClose && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-card border-r border-gray-200 dark:border-border
          flex flex-col shadow-sm
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#3F5B8B] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl text-[#3F5B8B]">PeiFeira</span>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <Separator />

        <div className="px-6 py-4 bg-gray-50 dark:bg-accent">
          <p className="text-sm font-semibold text-gray-900 dark:text-foreground truncate">
            {user?.nome}
          </p>
          <p className="text-xs text-gray-600 dark:text-muted-foreground truncate">{user?.email}</p>
          <p className="text-xs text-[#3F5B8B] dark:text-primary font-medium mt-1">{user?.tipo}</p>
        </div>

        <Separator />

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#6F73D2]/10 dark:bg-primary/20 text-[#6F73D2] dark:text-primary font-semibold'
                    : 'text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-accent'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <Separator />

        <div className="p-4">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </Button>
        </div>
      </aside>
    </>
  );
}
