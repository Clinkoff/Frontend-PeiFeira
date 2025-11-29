'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ProjetosPorStatus } from '@/lib/types';

interface ProjetosPorStatusChartProps {
  data: ProjetosPorStatus[];
}

const COLORS = ['#6F73D2', '#4ADE80', '#F59E0B', '#EF4444', '#8B5CF6'];

export function ProjetosPorStatusChart({ data }: ProjetosPorStatusChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projetos por Status</CardTitle>
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
        <CardTitle>Projetos por Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data as Record<string, any>[]}
              cx="50%"
              cy="50%"
              labelLine={false}
              // 1. Adicionado nameKey para mapear 'status' para 'name'
              nameKey="status"
              dataKey="quantidade"
              // 2. Corrigido o label: Ele recebe 'name' e 'value' (ou 'percent') do Recharts
              // Usamos 'any' aqui porque a tipagem do Recharts para labels customizados é complexa
              label={({ name, value }: any) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
