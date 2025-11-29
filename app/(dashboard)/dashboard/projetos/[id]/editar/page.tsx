'use client';

import { useRouter } from 'next/navigation';
import { useProjetos } from '@/lib/hooks/useProjeto';
import { ProjetoForm } from '@/components/features/projetos/ProjetoForm';
import type { UpdateProjetoFormData } from '@/lib/schemas/projeto.schema';
import { use } from 'react';

export default function EditarProjetoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { useProjetoById, update, isUpdating } = useProjetos();
  const { data: projeto, isLoading, error } = useProjetoById(resolvedParams.id);

  const handleSubmit = async (data: UpdateProjetoFormData) => {
    try {
      await update({ id: resolvedParams.id, data });
      router.push('/dashboard/projetos');
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      alert('Erro ao atualizar projeto. Tente novamente.');
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

  if (error || !projeto) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Projeto não encontrado.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/projetos')}
          className="text-blue-600 hover:underline"
        >
          ← Voltar para projetos
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Editar Projeto</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Atualize as informações do projeto {projeto.titulo}
        </p>
      </div>

      <ProjetoForm mode="edit" projeto={projeto} onSubmit={handleSubmit} isLoading={isUpdating} />
    </div>
  );
}
