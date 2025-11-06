'use client';

import { useRouter } from 'next/navigation';
import { useDisciplinasPI } from '@/lib/hooks/useDisciplinasPI';
import { DisciplinaPIForm } from '@/components/features/disciplinaPI/DisciplinaPIForm';
import type { CreateDisciplinaPIFormData } from '@/lib/schemas/disciplinaPI.schema';

export default function NovaDisciplinaPIPage() {
  const router = useRouter();
  const { create, isCreating } = useDisciplinasPI();

  const handleSubmit = async (data: CreateDisciplinaPIFormData) => {
    try {
      // Converter datas para ISO string completo
      const payload = {
        ...data,
        dataInicio: new Date(data.dataInicio).toISOString(),
        dataFim: new Date(data.dataFim).toISOString(),
      };

      await create(payload);
      router.push('/dashboard/disciplinas-pi');
    } catch (error) {
      console.error('Erro ao criar disciplina:', error);
      alert('Erro ao criar disciplina. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
          Nova Disciplina PI
        </h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Cadastre uma nova disciplina de Projeto Integrador
        </p>
      </div>

      <DisciplinaPIForm mode="create" onSubmit={handleSubmit} isLoading={isCreating} />
    </div>
  );
}
