'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Users,
  FolderKanban,
  GraduationCap,
  Calendar,
  School,
  UsersRound,
  BookOpen,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { ProjetosPorStatusChart } from '@/components/features/dashboard/ProjetosPorStatusChart';
import { DisciplinasPorSemestreChart } from '@/components/features/dashboard/DisciplinasPorSemestreChart';
import { ProjetosPorMesChart } from '@/components/features/dashboard/ProjetosPorMesChart';
import { AlunosPorTurmaChart } from '@/components/features/dashboard/AlunosPorTurmaChart';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    stats,
    isLoadingStats,
    projetosPorStatus,
    isLoadingProjetosStatus,
    disciplinasPorSemestre,
    isLoadingDisciplinasSemestre,
    projetosPorMes,
    isLoadingProjetosMes,
    alunosPorTurma,
    isLoadingAlunosTurma,
    atividadesRecentes,
    isLoadingAtividades,
  } = useDashboard();

  if (isLoadingStats) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-[#6F73D2]" />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Semestres',
      value: stats?.totalSemestres || 0,
      icon: Calendar,
      description: 'Total cadastrados',
      color: 'bg-orange-500',
    },
    {
      title: 'Usuários',
      value: stats?.totalUsuarios || 0,
      icon: Users,
      description: `${stats?.totalAlunos || 0} alunos, ${stats?.totalProfessores || 0} professores`,
      color: 'bg-blue-500',
    },
    {
      title: 'Turmas',
      value: stats?.totalTurmas || 0,
      icon: School,
      description: 'Turmas ativas',
      color: 'bg-purple-500',
    },
    {
      title: 'Disciplinas PI',
      value: stats?.totalDisciplinasPI || 0,
      icon: GraduationCap,
      description: `${stats?.disciplinasPIAtivas || 0} ativas`,
      color: 'bg-green-500',
    },
    {
      title: 'Equipes',
      value: stats?.totalEquipes || 0,
      icon: UsersRound,
      description: `${stats?.equipesAtivas || 0} ativas`,
      color: 'bg-pink-500',
    },
    {
      title: 'Projetos',
      value: stats?.totalProjetos || 0,
      icon: FolderKanban,
      description: `${stats?.projetosEmAndamento || 0} em andamento`,
      color: 'bg-cyan-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
          Bem-vindo, {user?.nome?.split(' ')[0]}
        </h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2">
          Visão geral do sistema de gestão de projetos integradores
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600 dark:text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projetos por Status */}
        {isLoadingProjetosStatus ? (
          <Card>
            <CardContent className="h-80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#6F73D2]" />
            </CardContent>
          </Card>
        ) : (
          <ProjetosPorStatusChart data={projetosPorStatus} />
        )}

        {/* Disciplinas por Semestre */}
        {isLoadingDisciplinasSemestre ? (
          <Card>
            <CardContent className="h-80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#6F73D2]" />
            </CardContent>
          </Card>
        ) : (
          <DisciplinasPorSemestreChart data={disciplinasPorSemestre} />
        )}
      </div>

      {/* Evolução de Projetos */}
      {isLoadingProjetosMes ? (
        <Card>
          <CardContent className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#6F73D2]" />
          </CardContent>
        </Card>
      ) : (
        <ProjetosPorMesChart data={projetosPorMes} />
      )}

      {/* Alunos por Turma */}
      {isLoadingAlunosTurma ? (
        <Card>
          <CardContent className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#6F73D2]" />
          </CardContent>
        </Card>
      ) : (
        <AlunosPorTurmaChart data={alunosPorTurma} />
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Atividades Recentes
          </CardTitle>
          <CardDescription>Últimas atualizações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAtividades ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#6F73D2]" />
            </div>
          ) : atividadesRecentes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-muted-foreground">
              Nenhuma atividade recente
            </div>
          ) : (
            <div className="space-y-4">
              {atividadesRecentes.slice(0, 5).map((atividade) => (
                <div
                  key={atividade.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-accent transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-[#6F73D2] mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                      {atividade.titulo}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-muted-foreground truncate">
                      {atividade.descricao}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(atividade.data).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
