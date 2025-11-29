// app/(dashboard)/equipes/[id]/editar/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEquipes } from '@/lib/hooks/useEquipes';
import { EquipeForm } from '@/components/features/equipes/EquipeForm';
import type { UpdateEquipeFormData } from '@/lib/schemas/equipes.schema';
import { use } from 'react';

export default function EditarEquipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { useEquipeById, update, isUpdating } = useEquipes();
  const { data: equipe, isLoading, error } = useEquipeById(resolvedParams.id);

  const handleSubmit = async (data: UpdateEquipeFormData) => {
    try {
      await update({ id: resolvedParams.id, data });
      router.push('/dashboard/equipes');
    } catch (error) {
      console.error('Erro ao atualizar equipe:', error);
      alert('Erro ao atualizar equipe. Tente novamente.');
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

  if (error || !equipe) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Equipe não encontrada.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/equipes')}
          className="text-blue-600 hover:underline"
        >
          ← Voltar para equipes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Editar Equipe</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Atualize as informações da equipe {equipe.nome}
        </p>
      </div>

      <EquipeForm mode="edit" equipe={equipe} onSubmit={handleSubmit} isLoading={isUpdating} />
    </div>
  );
}
