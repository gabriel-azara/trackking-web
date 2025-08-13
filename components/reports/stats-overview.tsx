"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Target,
  TrendingUp,
  CheckSquare,
  Flame,
  Calendar,
  Trophy,
} from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalHabits: number;
    activeHabits: number;
    longestStreak: number;
    currentStreak: number;
    totalGoals: number;
    completedGoals: number;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    weeklyAverage: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      title: "Hábitos Ativos",
      value: `${stats.activeHabits}/${stats.totalHabits}`,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Sequência Atual",
      value: `${stats.currentStreak} dias`,
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Maior Sequência",
      value: `${stats.longestStreak} dias`,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Metas Concluídas",
      value: `${stats.completedGoals}/${stats.totalGoals}`,
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Tarefas Concluídas",
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      icon: CheckSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Taxa de Conclusão",
      value: `${Math.round(stats.completionRate)}%`,
      icon: Calendar,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
