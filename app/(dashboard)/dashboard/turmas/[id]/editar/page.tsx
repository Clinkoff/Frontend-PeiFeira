'use client';

import { useRouter } from 'next/navigation';
import { useTurmas } from '@/lib/hooks/useTurmas';
import { TurmaForm } from '@/components/features/turmas/TurmaForm';
import type { UpdateTurmaFormData } from '@/lib/schemas/turma.schema';

interface EditarTurmaPageProps {
  params: { id: string };
}

export default function EditarTurmaPage({ params }: EditarTurmaPageProps) {
  const router = useRouter();
  const { useTurmaById, update, isUpdating } = useTurmas();
  const { data: turma, isLoading, error } = useTurmaById(params.id);

  const handleSubmit = async (data: UpdateTurmaFormData) => {
    try {
      await update({ id: params.id, data });
      router.push('/dashboard/turmas');
    } catch (error) {
      console.error('Erro ao atualizar turma:', error);
      alert('Erro ao atualizar turma. Tente novamente.');
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

  if (error || !turma) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Turma não encontrada.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/turmas')}
          className="text-blue-600 hover:underline"
        >
          ← Voltar para turmas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Editar Turma</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Atualize as informações da turma {turma.nome}
        </p>
      </div>

      <TurmaForm mode="edit" turma={turma} onSubmit={handleSubmit} isLoading={isUpdating} />
    </div>
  );
}
