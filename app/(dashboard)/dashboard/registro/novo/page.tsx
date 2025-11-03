// app/(dashboard)/registro/novo/page.tsx
'use client';

import { UsuarioForm } from '@/components/features/usuarios/UsuarioForm';
import { useUsuarios } from '@/lib/hooks/useUsuarios';
import { useRouter } from 'next/navigation';
import type { CreateUsuarioRequest } from '@/lib/types/usuario.types';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const { create, isCreating } = useUsuarios();

  const handleSubmit = async (data: any) => {
    try {
      const { confirmPassword, ...dataToSend } = data;

      const payload: CreateUsuarioRequest = {
        matricula: dataToSend.matricula,
        nome: dataToSend.nome,
        email: dataToSend.email,
        senha: dataToSend.senha,
        role: dataToSend.role,
      };

      if (dataToSend.role === 'Aluno' && dataToSend.perfilAluno) {
        payload.perfilAluno = {
          curso: dataToSend.perfilAluno.curso,
          turno: dataToSend.perfilAluno.turno,
        };
      }

      if (dataToSend.role === 'Professor' && dataToSend.perfilProfessor) {
        payload.perfilProfessor = {
          departamento: dataToSend.perfilProfessor.departamento,
          titulacao: dataToSend.perfilProfessor.titulacao,
          areaEspecializacao: dataToSend.perfilProfessor.areaEspecializacao,
        };
      }

      console.log('Payload enviado ao backend:', payload);
      await create(payload);
      router.push('/dashboard/registro');
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      const errorMessage =
        error?.response?.data?.message || 'Erro ao criar usuário. Tente novamente.';
      alert(errorMessage);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">Novo Usuário</h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">Cadastre um novo usuário</p>
      </div>

      <UsuarioForm mode="create" onSubmit={handleSubmit} isLoading={isCreating} />
    </div>
  );
}
