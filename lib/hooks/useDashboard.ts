import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/dashboardApi';

export const useDashboard = () => {
  const statsQuery = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const projetosPorStatusQuery = useQuery({
    queryKey: ['dashboard-projetos-status'],
    queryFn: dashboardApi.getProjetosPorStatus,
    staleTime: 5 * 60 * 1000,
  });

  const disciplinasPorSemestreQuery = useQuery({
    queryKey: ['dashboard-disciplinas-semestre'],
    queryFn: dashboardApi.getDisciplinasPorSemestre,
    staleTime: 5 * 60 * 1000,
  });

  const projetosPorMesQuery = useQuery({
    queryKey: ['dashboard-projetos-mes'],
    queryFn: dashboardApi.getProjetosPorMes,
    staleTime: 5 * 60 * 1000,
  });

  const alunosPorTurmaQuery = useQuery({
    queryKey: ['dashboard-alunos-turma'],
    queryFn: dashboardApi.getAlunosPorTurma,
    staleTime: 5 * 60 * 1000,
  });

  const atividadesRecentesQuery = useQuery({
    queryKey: ['dashboard-atividades'],
    queryFn: dashboardApi.getAtividadesRecentes,
    staleTime: 1 * 60 * 1000,
  });

  return {
    stats: statsQuery.data,
    isLoadingStats: statsQuery.isLoading,

    projetosPorStatus: projetosPorStatusQuery.data || [],
    isLoadingProjetosStatus: projetosPorStatusQuery.isLoading,

    disciplinasPorSemestre: disciplinasPorSemestreQuery.data || [],
    isLoadingDisciplinasSemestre: disciplinasPorSemestreQuery.isLoading,

    projetosPorMes: projetosPorMesQuery.data || [],
    isLoadingProjetosMes: projetosPorMesQuery.isLoading,

    alunosPorTurma: alunosPorTurmaQuery.data || [],
    isLoadingAlunosTurma: alunosPorTurmaQuery.isLoading,

    atividadesRecentes: atividadesRecentesQuery.data || [],
    isLoadingAtividades: atividadesRecentesQuery.isLoading,

    isLoading:
      statsQuery.isLoading ||
      projetosPorStatusQuery.isLoading ||
      disciplinasPorSemestreQuery.isLoading ||
      projetosPorMesQuery.isLoading,
  };
};
