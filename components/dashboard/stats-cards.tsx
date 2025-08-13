"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, TrendingUp, CheckCircle, Flame } from "lucide-react"

interface StatsCardsProps {
  stats: {
    habitsToday: number
    habitsCompleted: number
    activeGoals: number
    currentStreak: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Hábitos Hoje",
      value: `${stats.habitsCompleted}/${stats.habitsToday}`,
      description: "Hábitos concluídos hoje",
      icon: Target,
      color: "text-blue-600",
    },
    {
      title: "Metas Ativas",
      value: stats.activeGoals,
      description: "Metas em progresso",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Streak Atual",
      value: stats.currentStreak,
      description: "Dias consecutivos",
      icon: Flame,
      color: "text-orange-600",
    },
    {
      title: "Taxa de Conclusão",
      value: stats.habitsToday > 0 ? `${Math.round((stats.habitsCompleted / stats.habitsToday) * 100)}%` : "0%",
      description: "Hoje",
      icon: CheckCircle,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
