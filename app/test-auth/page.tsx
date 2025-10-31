// app/test-auth/page.tsx
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';

export default function TestAuthPage() {
  const { user, isAuthenticated, login, logout, isLoggingIn, isLoadingUser } = useAuth();

  const handleTestLogin = async () => {
    try {
      await login({
        matricula: 'admin',
        senha: 'Admin@123',
      });
      alert('Login bem-sucedido!');
    } catch (error) {
      alert('Erro no login: ' + (error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      alert('Logout bem-sucedido!');
    } catch (error) {
      alert('Erro no logout: ' + (error as Error).message);
    }
  };

  if (isLoadingUser) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold">Teste de Autenticação</h1>

        <div className="space-y-2">
          <p className="text-sm">
            <strong>Status:</strong>{' '}
            <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
              {isAuthenticated ? '✅ Autenticado' : '❌ Não autenticado'}
            </span>
          </p>

          {user && (
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm">
                <strong>Nome:</strong> {user.nome}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm">
                <strong>Role:</strong> {user.role}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {!isAuthenticated ? (
            <Button onClick={handleTestLogin} disabled={isLoggingIn} className="w-full">
              {isLoggingIn ? 'Fazendo login...' : 'Testar Login'}
            </Button>
          ) : (
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              Fazer Logout
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>✅ Axios Client configurado</p>
          <p>✅ Zustand Store funcionando</p>
          <p>✅ React Query integrado</p>
          <p>✅ useAuth hook criado</p>
        </div>
      </div>
    </div>
  );
}
