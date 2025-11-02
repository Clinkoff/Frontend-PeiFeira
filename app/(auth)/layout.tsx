import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#96A4C5] via-[#3F5B8B] to-[#2E365A] dark:from-[#1a1f3a] dark:via-[#2a3759] dark:to-[#0f1419]"
    >
      {children}
    </div>
  );
}
