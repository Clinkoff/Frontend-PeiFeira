'use client';

import { Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ConvitesBadge } from '../shared/ConvitesBadge';
import { NotificationPanel } from '../shared/NotificationPanel';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 h-16! bg-white dark:bg-card border-b border-gray-200 dark:border-border flex items-center justify-between px-4! lg:px-6!">
      {/* Left Side - Menu Button (mobile) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2! hover:bg-gray-100 dark:hover:bg-accent rounded-lg transition-colors"
        >
          <Menu className="w-6! h-6! text-gray-700 dark:text-foreground" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-foreground hidden sm:block">
          Sistema de Gestão Acadêmica
        </h1>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <NotificationPanel />

        {/* User Profile */}
        <Button variant="outline" className="gap-2">
          <User className="w-5! h-5!" />
          <span className="hidden md:inline">{user?.nome?.split(' ')[0]}</span>
        </Button>
      </div>
    </header>
  );
}
