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
import type { DisciplinasPorSemestre } from '@/lib/types';

interface DisciplinasPorSemestreChartProps {
  data: DisciplinasPorSemestre[];
}

export function DisciplinasPorSemestreChart({ data }: DisciplinasPorSemestreChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Disciplinas por Semestre</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center text-gray-500 dark:text-muted-foreground">
          Nenhum dado disponível
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disciplinas PI por Semestre</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="semestre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantidade" fill="#6F73D2" name="Disciplinas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
