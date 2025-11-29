// app/(dashboard)/equipes/novo/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEquipes } from '@/lib/hooks/useEquipes';
import { EquipeForm } from '@/components/features/equipes/EquipeForm';
import type { CreateEquipeFormData } from '@/lib/schemas/equipes.schema';

export default function NovaEquipePage() {
  const router = useRouter();
  const { create, isCreating } = useEquipes();

  const handleSubmit = async (data: CreateEquipeFormData) => {
    try {
      await create(data);
      router.push('/dashboard/equipes');
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      alert('Erro ao criar equipe. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Nova Equipe</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Cadastre uma nova equipe de projeto
        </p>
      </div>

      <EquipeForm mode="create" onSubmit={handleSubmit} isLoading={isCreating} />
    </div>
  );
}
