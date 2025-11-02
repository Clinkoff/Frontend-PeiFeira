// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderKanban, GraduationCap, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Disciplinas PI',
      value: '8',
      icon: GraduationCap,
      description: 'Ativas neste semestre',
      color: 'bg-blue-500',
    },
    {
      title: 'Projetos',
      value: '24',
      icon: FolderKanban,
      description: 'Em desenvolvimento',
      color: 'bg-green-500',
    },
    {
      title: 'Equipes',
      value: '24',
      icon: Users,
      description: 'Registradas',
      color: 'bg-purple-500',
    },
    {
      title: 'Semestres',
      value: '3',
      icon: Calendar,
      description: 'Cadastrados',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6!">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl! font-bold text-gray-900 dark:text-foreground">
          Bem-vindo, {user?.nome?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 dark:text-muted-foreground mt-2!">
          Aqui está um resumo do sistema de gestão de projetos integradores
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2! lg:grid-cols-4! gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2!">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2! rounded-lg ${stat.color}`}>
                  <Icon className="w-4! h-4! text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 dark:text-foreground">{stat.value}</div>
                <p className="text-xs text-gray-600 dark:text-muted-foreground mt-1!">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas atualizações do sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4!">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3! rounded-lg hover:bg-gray-50 dark:hover:bg-accent">
                <div className="w-2! h-2! rounded-full bg-[#6F73D2]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                    Novo projeto cadastrado na disciplina PI IV
                  </p>
                  <p className="text-xs text-gray-600 dark:text-muted-foreground">Há 2 horas</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
