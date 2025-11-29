'use client';

import { useRouter } from 'next/navigation';
import { useProjetos } from '@/lib/hooks/useProjeto';
import { ProjetoForm } from '@/components/features/projetos/ProjetoForm';
import type { CreateProjetoFormData } from '@/lib/schemas/projeto.schema';

export default function NovoProjetoPage() {
  const router = useRouter();
  const { create, isCreating } = useProjetos();

  const handleSubmit = async (data: CreateProjetoFormData) => {
    try {
      await create(data);
      router.push('/dashboard/projetos');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      alert('Erro ao criar projeto. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Novo Projeto</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Cadastre um novo projeto integrador
        </p>
      </div>

      <ProjetoForm mode="create" onSubmit={handleSubmit} isLoading={isCreating} />
    </div>
  );
}
