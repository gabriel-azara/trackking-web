"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Habit, HabitLog } from "@/lib/types"
import { cn } from "@/lib/utils"
import * as LucideIcons from "lucide-react"

interface HabitCardProps {
  habit: Habit & { todayLog?: HabitLog }
  onToggleToday?: (habitId: string, completed: boolean, value?: number) => void
  onEdit?: (habit: Habit) => void
  onDelete?: (habit: Habit) => void
}

export function HabitCard({ habit, onToggleToday, onEdit, onDelete }: HabitCardProps) {
  const getHabitProgress = () => {
    if (!habit.target) return habit.todayLog?.completed ? 100 : 0
    if (!habit.todayLog?.value) return 0
    return Math.min((habit.todayLog.value / habit.target) * 100, 100)
  }

  const getColorStyle = (color?: string) => {
    if (!color) return {}
    if (color.startsWith("#")) {
      return { backgroundColor: color }
    }
    return {}
  }

  const getColorClass = (color?: string) => {
    if (!color) return "bg-gray-500"
    if (color.startsWith("#")) return ""
    return `bg-${color}`
  }

  const renderIcon = (iconName?: string) => {
    if (!iconName) return <LucideIcons.Circle className="h-5 w-5" />

    const IconComponent = (LucideIcons as any)[
      iconName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
        .replace(/[^a-zA-Z0-9]/g, "")
    ]

    if (IconComponent) {
      return <IconComponent className="h-5 w-5" />
    }
    return <LucideIcons.Circle className="h-5 w-5" />
  }

  const progress = getHabitProgress()
  const isCompleted = habit.todayLog?.completed || progress >= 100

  const getFrequencyText = () => {
    switch (habit.frequency.kind) {
      case "daily":
        return habit.frequency.times ? `${habit.frequency.times}x por dia` : "Diário"
      case "weekly":
        return `${habit.frequency.days?.length || 0} dias por semana`
      case "monthly":
        return `${habit.frequency.dates?.length || 0} dias por mês`
      case "custom":
        return "Personalizado"
      default:
        return "Diário"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div
              className={cn("w-3 h-3 rounded-full", getColorClass(habit.color))}
              style={getColorStyle(habit.color)}
            />
            <div className="flex items-center space-x-2">
              {renderIcon(habit.icon)}
              <div>
                <h3 className="font-medium">{habit.title}</h3>
                {habit.description && <p className="text-sm text-muted-foreground">{habit.description}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {getFrequencyText()}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(habit)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(habit)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {habit.target && habit.unit && (
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {habit.todayLog?.value || 0} / {habit.target} {habit.unit}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <Badge variant={isCompleted ? "default" : "secondary"}>{isCompleted ? "Concluído" : "Pendente"}</Badge>

          {onToggleToday && (
            <Button
              size="sm"
              variant={isCompleted ? "default" : "outline"}
              onClick={() => onToggleToday(habit.id, !isCompleted)}
            >
              {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
