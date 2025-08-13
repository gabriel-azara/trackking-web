"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Plus, Calendar } from "lucide-react"
import type { Goal } from "@/lib/types"
import { getDaysUntil, isOverdue } from "@/lib/utils/date"

interface GoalsOverviewProps {
  goals: Goal[]
}

export function GoalsOverview({ goals }: GoalsOverviewProps) {
  const getGoalProgress = (goal: Goal) => {
    if (!goal.targetValue || !goal.progressValue) return 0
    return Math.min((goal.progressValue / goal.targetValue) * 100, 100)
  }

  const getDeadlineStatus = (deadline?: string) => {
    if (!deadline) return null
    const days = getDaysUntil(deadline)
    const overdue = isOverdue(deadline)

    if (overdue) return { text: "Atrasado", variant: "destructive" as const }
    if (days <= 7) return { text: `${days} dias`, variant: "secondary" as const }
    return { text: `${days} dias`, variant: "outline" as const }
  }

  const topGoals = goals
    .filter((goal) => goal.deadline)
    .sort((a, b) => getDaysUntil(a.deadline!) - getDaysUntil(b.deadline!))
    .slice(0, 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Metas em Destaque
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topGoals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma meta definida</p>
            <p className="text-sm">Crie sua primeira meta para começar!</p>
          </div>
        ) : (
          topGoals.map((goal) => {
            const progress = getGoalProgress(goal)
            const deadlineStatus = getDeadlineStatus(goal.deadline)

            return (
              <div key={goal.id} className="space-y-3 p-3 rounded-lg border">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h4 className="font-medium">{goal.title}</h4>
                    {goal.description && <p className="text-sm text-muted-foreground">{goal.description}</p>}
                  </div>
                  {deadlineStatus && (
                    <Badge variant={deadlineStatus.variant}>
                      <Calendar className="h-3 w-3 mr-1" />
                      {deadlineStatus.text}
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  {goal.targetValue && goal.unit && (
                    <div className="text-xs text-muted-foreground">
                      {goal.progressValue || 0} / {goal.targetValue} {goal.unit}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
