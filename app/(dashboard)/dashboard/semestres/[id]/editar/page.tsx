'use client';

import { useRouter } from 'next/navigation';
import { useSemestres } from '@/lib/hooks/useSemestres';
import { SemestreForm } from '@/components/features/semestres/SemestreForm';
import type { UpdateSemestreFormData } from '@/lib/schemas/semestre.schema';
import { use } from 'react';

export default function EditarSemestrePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { useSemestreById, update, isUpdating } = useSemestres();
  const { data: semestre, isLoading, error } = useSemestreById(resolvedParams.id);

  const handleSubmit = async (data: UpdateSemestreFormData) => {
    try {
      await update({ id: resolvedParams.id, data });
      router.push('/dashboard/semestres');
    } catch (error) {
      console.error('Erro ao atualizar semestre:', error);
      alert('Erro ao atualizar semestre. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !semestre) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Semestre não encontrado.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/semestres')}
          className="text-blue-600 hover:underline"
        >
          ← Voltar para semestres
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Editar Semestre</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Atualize as informações do semestre {semestre.nome}
        </p>
      </div>

      <SemestreForm
        mode="edit"
        semestre={semestre}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
