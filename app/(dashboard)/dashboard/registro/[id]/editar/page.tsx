'use client';

import { useRouter } from 'next/navigation';
import { useUsuarios } from '@/lib/hooks/useUsuarios';
import { UsuarioForm } from '@/components/features/usuarios/UsuarioForm';
import type { UpdateUsuarioFormData } from '@/lib/schemas/usuario.schema';
import { use } from 'react';

export default function EditarUsuarioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { useUsuarioById, update, isUpdating } = useUsuarios();
  const { data: usuario, isLoading, error } = useUsuarioById(resolvedParams.id);

  const handleSubmit = async (data: UpdateUsuarioFormData) => {
    try {
      await update({ id: resolvedParams.id, data });
      router.push('/dashboard/registro');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Usuário não encontrado.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/registro')}
          className="text-blue-600 hover:underline"
        >
          ← Voltar para usuários
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Editar Usuário</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Atualize as informações de {usuario.nome}
        </p>
      </div>

      <UsuarioForm mode="edit" usuario={usuario} onSubmit={handleSubmit} isLoading={isUpdating} />
    </div>
  );
}
