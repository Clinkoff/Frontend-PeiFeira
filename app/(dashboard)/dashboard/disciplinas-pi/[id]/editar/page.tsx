// app/(dashboard)/disciplinaspi/[id]/editar/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useDisciplinasPI } from '@/lib/hooks/useDisciplinasPI';
import { DisciplinaPIForm } from '@/components/features/disciplinaPI/DisciplinaPIForm';
import type { UpdateDisciplinaPIFormData } from '@/lib/schemas/disciplinaPI.schema';
import { use } from 'react';

export default function EditarDisciplinaPIPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { useDisciplinaPIById, update, isUpdating } = useDisciplinasPI();
  const { data: disciplina, isLoading, error } = useDisciplinaPIById(resolvedParams.id);

  const handleSubmit = async (data: UpdateDisciplinaPIFormData) => {
    try {
      // Converter datas para ISO string completo
      const payload = {
        ...data,
        dataInicio: new Date(data.dataInicio).toISOString(),
        dataFim: new Date(data.dataFim).toISOString(),
      };

      await update({ id: resolvedParams.id, data: payload });
      router.push('/dashboard/disciplinaspi');
    } catch (error) {
      console.error('Erro ao atualizar disciplina:', error);
      alert('Erro ao atualizar disciplina. Tente novamente.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse" />
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !disciplina) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Erro</h1>
          <p className="text-red-600 mt-2">Disciplina não encontrada.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard/disciplinaspi')}
          className="text-blue-600 hover:underline"
        >
          ← Voltar para disciplinas
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
          Editar Disciplina PI
        </h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Atualize as informações da disciplina {disciplina.nome}
        </p>
      </div>

      <DisciplinaPIForm
        mode="edit"
        disciplina={disciplina}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
