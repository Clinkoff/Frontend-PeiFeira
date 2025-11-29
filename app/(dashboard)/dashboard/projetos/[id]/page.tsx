'use client';

import { ArrowLeft, Building2, GraduationCap, Users, Mail, Pencil } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import { useProjetos } from '@/lib/hooks/useProjeto';
import { StatusProjetoLabels, StatusProjetoColors } from '@/lib/types/projetos.types';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function ProjetoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { useProjetoByIdWithDetails } = useProjetos();
  const { data: projeto, isLoading } = useProjetoByIdWithDetails(id);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!projeto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-gray-600 dark:text-muted-foreground">Projeto não encontrado</p>
        <Link href="/dashboard/projetos">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4! w-4!" />
            Voltar para projetos
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projetos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5! w-5!" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-foreground">
              {projeto.titulo}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center rounded-full px-2.5! py-0.5! text-xs font-medium ${StatusProjetoColors[projeto.status]}`}
              >
                {StatusProjetoLabels[projeto.status]}
              </span>
              {projeto.nomeEmpresa ? (
                <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-muted-foreground">
                  <Building2 className="h-3.5! w-3.5!" />
                  Com Empresa
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-muted-foreground">
                  <GraduationCap className="h-3.5! w-3.5!" />
                  Acadêmico
                </span>
              )}
            </div>
          </div>
        </div>
        <Link href={`/dashboard/projetos/${projeto.id}/editar`}>
          <Button className="gap-2">
            <Pencil className="h-4! w-4!" />
            Editar
          </Button>
        </Link>
      </div>

      {/* Desafio Proposto */}
      <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-3">
          Desafio Proposto
        </h3>
        <p className="text-gray-700 dark:text-foreground whitespace-pre-wrap">
          {projeto.desafioProposto}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Disciplina PI */}
        {projeto.disciplinaPI && (
          <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4 flex items-center gap-2">
              <GraduationCap className="h-5! w-5!" />
              Disciplina PI
            </h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Nome</p>
                <p className="font-medium text-gray-900 dark:text-foreground">
                  {projeto.disciplinaPI.nome}
                </p>
              </div>
              {projeto.disciplinaPI.professor && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground">Professor</p>
                  <p className="font-medium text-gray-900 dark:text-foreground">
                    {projeto.disciplinaPI.professor}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Equipe */}
        {projeto.equipe && (
          <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4 flex items-center gap-2">
              <Users className="h-5! w-5!" />
              Equipe
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Nome da Equipe</p>
                <p className="font-medium text-gray-900 dark:text-foreground">
                  {projeto.equipe.nome}
                </p>
              </div>

              {projeto.equipe.lider && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground mb-2">Líder</p>
                  <div className="flex items-center gap-2 p-3 rounded-md bg-gray-50 dark:bg-accent">
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-foreground">
                        {projeto.equipe.lider.nome}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3! w-3!" />
                        {projeto.equipe.lider.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {projeto.equipe.membros && projeto.equipe.membros.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground mb-2">
                    Membros ({projeto.equipe.membros.length})
                  </p>
                  <div className="space-y-2">
                    {projeto.equipe.membros.map((membro) => (
                      <div
                        key={membro.id}
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-accent transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm text-gray-900 dark:text-foreground">
                            {membro.nome}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3! w-3!" />
                            {membro.email}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dados da Empresa */}
      {projeto.nomeEmpresa && (
        <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4 flex items-center gap-2">
            <Building2 className="h-5! w-5!" />
            Dados da Empresa
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600 dark:text-muted-foreground">Nome</p>
              <p className="font-medium text-gray-900 dark:text-foreground">
                {projeto.nomeEmpresa}
              </p>
            </div>
            {projeto.cidade && (
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Cidade</p>
                <p className="font-medium text-gray-900 dark:text-foreground">{projeto.cidade}</p>
              </div>
            )}
            {projeto.enderecoCompleto && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Endereço</p>
                <p className="font-medium text-gray-900 dark:text-foreground">
                  {projeto.enderecoCompleto}
                </p>
              </div>
            )}
            {projeto.contato && (
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Contato</p>
                <p className="font-medium text-gray-900 dark:text-foreground">{projeto.contato}</p>
              </div>
            )}
            {projeto.redeSocial && (
              <div>
                <p className="text-sm text-gray-600 dark:text-muted-foreground">Rede Social</p>
                <p className="font-medium text-gray-900 dark:text-foreground">
                  {projeto.redeSocial}
                </p>
              </div>
            )}
          </div>

          {/* Responsável */}
          {projeto.nomeResponsavel && (
            <>
              <Separator className="my-6" />
              <h4 className="font-semibold text-gray-900 dark:text-foreground mb-4">Responsável</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground">Nome</p>
                  <p className="font-medium text-gray-900 dark:text-foreground">
                    {projeto.nomeResponsavel}
                  </p>
                </div>
                {projeto.cargoResponsavel && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Cargo</p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {projeto.cargoResponsavel}
                    </p>
                  </div>
                )}
                {projeto.emailResponsavel && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">E-mail</p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {projeto.emailResponsavel}
                    </p>
                  </div>
                )}
                {projeto.telefoneResponsavel && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Telefone</p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {projeto.telefoneResponsavel}
                    </p>
                  </div>
                )}
                {projeto.redesSociaisResponsavel && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                      Redes Sociais
                    </p>
                    <p className="font-medium text-gray-900 dark:text-foreground">
                      {projeto.redesSociaisResponsavel}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Metadados */}
      <div className="rounded-lg border border-gray-200 dark:border-border bg-white dark:bg-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-foreground mb-4">
          Informações do Sistema
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">Criado em</p>
            <p className="font-medium text-gray-900 dark:text-foreground">
              {projeto.criadoEm
                ? new Date(projeto.criadoEm).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">Última atualização</p>
            <p className="font-medium text-gray-900 dark:text-foreground">
              {projeto.alteradoEm
                ? new Date(projeto.alteradoEm).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-muted-foreground">Status</p>
            <p className="font-medium text-gray-900 dark:text-foreground">
              {projeto.isActive ? 'Ativo' : 'Inativo'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
