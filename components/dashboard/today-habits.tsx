"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Plus } from "lucide-react"
import { Target } from "lucide-react" // Import the Target component
import type { Habit, HabitLog } from "@/lib/types"

interface TodayHabitsProps {
  habits: (Habit & { todayLog?: HabitLog })[]
  onToggleHabit: (habitId: string, completed: boolean, value?: number) => void
}

export function TodayHabits({ habits, onToggleHabit }: TodayHabitsProps) {
  const getHabitProgress = (habit: Habit & { todayLog?: HabitLog }) => {
    if (!habit.target) return habit.todayLog?.completed ? 100 : 0
    if (!habit.todayLog?.value) return 0
    return Math.min((habit.todayLog.value / habit.target) * 100, 100)
  }

  const getHabitColor = (color?: string) => {
    if (!color) return "bg-gray-500"
    if (color.startsWith("#")) return color
    return `bg-${color}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Hábitos de Hoje
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Novo Hábito
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum hábito para hoje</p>
            <p className="text-sm">Crie seu primeiro hábito para começar!</p>
          </div>
        ) : (
          habits.map((habit) => {
            const progress = getHabitProgress(habit)
            const isCompleted = habit.todayLog?.completed || progress >= 100

            return (
              <div key={habit.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                <div
                  className={`w-3 h-3 rounded-full ${getHabitColor(habit.color)}`}
                  style={habit.color?.startsWith("#") ? { backgroundColor: habit.color } : {}}
                />

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{habit.title}</h4>
                    <Badge variant={isCompleted ? "default" : "secondary"}>
                      {isCompleted ? "Concluído" : "Pendente"}
                    </Badge>
                  </div>

                  {habit.target && habit.unit && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {habit.todayLog?.value || 0} / {habit.target} {habit.unit}
                        </span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  variant={isCompleted ? "default" : "outline"}
                  onClick={() => onToggleHabit(habit.id, !isCompleted)}
                >
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </Button>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
