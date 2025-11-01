// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white  shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao PeiFeira! 👋</h1>
          <p className="text-gray-600">Sistema de Gestão de Projetos Integradores</p>
        </div>

        {/* User Info */}
        <div className="bg-white shadow-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Informações do Usuário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="font-semibold text-gray-900">{user?.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Matrícula</p>
              <p className="font-semibold text-gray-900">{user?.matricula}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Perfil</p>
              <p className="font-semibold text-gray-900">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white shadow-lg p-6">
          <Button onClick={handleLogout} variant="destructive">
            Fazer Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
