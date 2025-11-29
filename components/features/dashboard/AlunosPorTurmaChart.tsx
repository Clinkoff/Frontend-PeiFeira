'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { AlunosPorTurma } from '@/lib/types';

interface AlunosPorTurmaChartProps {
  data: AlunosPorTurma[];
}

export function AlunosPorTurmaChart({ data }: AlunosPorTurmaChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alunos por Turma</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center text-gray-500 dark:text-muted-foreground">
          Nenhum dado disponível
        </CardContent>
      </Card>
    );
  }

  // Pegar apenas top 10 turmas
  const topTurmas = data.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Turmas por Alunos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topTurmas} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="turma" type="category" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantidade" fill="#8B5CF6" name="Alunos" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
