"use client";

import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { subDays, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/reports/date-range-picker";
import { StatsOverview } from "@/components/reports/stats-overview";
import { ProgressChart } from "@/components/reports/progress-chart";
import { HabitHeatmap } from "@/components/reports/habit-heatmap";

// Mock data - em produção, estes dados viriam do Firebase
const mockStats = {
  totalHabits: 12,
  activeHabits: 8,
  longestStreak: 45,
  currentStreak: 12,
  totalGoals: 6,
  completedGoals: 2,
  totalTasks: 24,
  completedTasks: 18,
  completionRate: 75,
  weeklyAverage: 82,
};

const mockProgressData = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), "yyyy-MM-dd"),
  habits: Math.floor(Math.random() * 40) + 60,
  goals: Math.floor(Math.random() * 30) + 50,
  tasks: Math.floor(Math.random() * 35) + 65,
}));

const mockHeatmapData = Array.from({ length: 90 }, (_, i) => ({
  date: format(subDays(new Date(), 89 - i), "yyyy-MM-dd"),
  completed: Math.floor(Math.random() * 8) + 2,
  total: 10,
}));

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e analise suas conquistas
          </p>
        </div>
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={mockStats} />

      {/* Charts and Analytics */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="progress">Progresso</TabsTrigger>
          <TabsTrigger value="heatmap">Mapa de Calor</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <ProgressChart data={mockProgressData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <HabitHeatmap data={mockHeatmapData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Melhor Dia da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  Segunda-feira
                </div>
                <p className="text-sm text-muted-foreground">
                  85% de taxa de conclusão média
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horário Mais Produtivo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  08:00 - 10:00
                </div>
                <p className="text-sm text-muted-foreground">
                  Maior número de hábitos concluídos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categoria Mais Consistente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">Saúde</div>
                <p className="text-sm text-muted-foreground">
                  92% de consistência nos últimos 30 dias
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próxima Meta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  30 dias
                </div>
                <p className="text-sm text-muted-foreground">
                  Para atingir sequência de 50 dias
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
