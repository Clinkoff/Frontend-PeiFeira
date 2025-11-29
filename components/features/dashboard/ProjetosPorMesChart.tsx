'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ProjetosPorMes } from '@/lib/types';

interface ProjetosPorMesChartProps {
  data: ProjetosPorMes[];
}

export function ProjetosPorMesChart({ data }: ProjetosPorMesChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Projetos</CardTitle>
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
        <CardTitle>Evolução de Projetos (Últimos 6 meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="criados"
              stroke="#6F73D2"
              name="Criados"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="concluidos"
              stroke="#4ADE80"
              name="Concluídos"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
