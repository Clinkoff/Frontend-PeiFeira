import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #D9F0FF 0%, #A3D5FF 50%, #83C9F4 100%)',
      }}
    >
      {children}
    </div>
  );
}
