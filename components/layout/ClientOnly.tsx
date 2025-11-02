'use client';

import { useEffect, useState } from 'react';
import { LoadingSkeleton } from '../shared/LoadingSkeleton';

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSkeleton />; // ✅ Renderiza instância do componente
  }

  return <>{children}</>;
}
