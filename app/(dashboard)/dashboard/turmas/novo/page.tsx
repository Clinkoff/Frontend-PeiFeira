'use client';

import { useRouter } from 'next/navigation';
import { useTurmas } from '@/lib/hooks/useTurmas';
import { TurmaForm } from '@/components/features/turmas/TurmaForm';
import type { CreateTurmaFormData } from '@/lib/schemas/turma.schema';

export default function NovaTurmaPage() {
  const router = useRouter();
  const { create, isCreating } = useTurmas();

  const handleSubmit = async (data: CreateTurmaFormData) => {
    try {
      await create(data);
      router.push('/dashboard/turmas');
    } catch (error) {
      console.error('Erro ao criar turma:', error);
      alert('Erro ao criar turma. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Nova Turma</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Cadastre uma nova turma acadêmica
        </p>
      </div>

      <TurmaForm mode="create" onSubmit={handleSubmit} isLoading={isCreating} />
    </div>
  );
}
