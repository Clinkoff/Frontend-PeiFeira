'use client';

import { useRouter } from 'next/navigation';
import { useSemestres } from '@/lib/hooks/useSemestres';
import { SemestreForm } from '@/components/features/semestres/SemestreForm';

export default function NovoSemestrePage() {
  const router = useRouter();
  const { create, isCreating } = useSemestres();

  const handleSubmit = async (data: any) => {
    try {
      await create(data);
      router.push('/dashboard/semestres');
    } catch (error) {
      console.error('Erro ao criar semestre:', error);
      alert('Erro ao criar semestre. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Novo Semestre</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Cadastre um novo semestre acadêmico
        </p>
      </div>

      <SemestreForm mode="create" onSubmit={handleSubmit} isLoading={isCreating} />
    </div>
  );
}
