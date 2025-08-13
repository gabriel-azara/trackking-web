"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProgressChartProps {
  data: Array<{
    date: string;
    habits: number;
    goals: number;
    tasks: number;
  }>;
  className?: string;
}

export function ProgressChart({ data, className }: ProgressChartProps) {
  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "dd/MM", { locale: ptBR });
  };

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">
        Progresso ao Longo do Tempo
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(value) => formatDate(value as string)}
            formatter={(value, name) => [
              `${value}%`,
              name === "habits"
                ? "Hábitos"
                : name === "goals"
                ? "Metas"
                : "Tarefas",
            ]}
          />
          <Line
            type="monotone"
            dataKey="habits"
            stroke="#10b981"
            strokeWidth={2}
            name="habits"
          />
          <Line
            type="monotone"
            dataKey="goals"
            stroke="#3b82f6"
            strokeWidth={2}
            name="goals"
          />
          <Line
            type="monotone"
            dataKey="tasks"
            stroke="#f59e0b"
            strokeWidth={2}
            name="tasks"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
