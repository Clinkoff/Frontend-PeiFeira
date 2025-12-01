'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConvites } from '@/lib/hooks/useConvites';

export function ConvitesBadge() {
  const { countPendentes } = useConvites();

  return (
    <Link href="/convites">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        {countPendentes > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {countPendentes > 9 ? '9+' : countPendentes}
          </span>
        )}
      </Button>
    </Link>
  );
}
