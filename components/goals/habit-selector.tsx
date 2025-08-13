"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"
import { subscribeToUserHabits } from "@/lib/firebase/habits"
import type { Habit } from "@/lib/types"
import * as LucideIcons from "lucide-react"

interface HabitSelectorProps {
  selectedHabits: string[]
  onChange: (habitIds: string[]) => void
}

export function HabitSelector({ selectedHabits, onChange }: HabitSelectorProps) {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUserHabits(user.uid, (fetchedHabits) => {
      setHabits(fetchedHabits.filter((h) => !h.archive))
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const toggleHabit = (habitId: string) => {
    const newSelection = selectedHabits.includes(habitId)
      ? selectedHabits.filter((id) => id !== habitId)
      : [...selectedHabits, habitId]
    onChange(newSelection)
  }

  const renderIcon = (iconName?: string) => {
    if (!iconName) return <LucideIcons.Circle className="h-4 w-4" />

    const IconComponent = (LucideIcons as any)[
      iconName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
        .replace(/[^a-zA-Z0-9]/g, "")
    ]

    if (IconComponent) {
      return <IconComponent className="h-4 w-4" />
    }
    return <LucideIcons.Circle className="h-4 w-4" />
  }

  const getColorClass = (color?: string) => {
    if (!color) return "bg-gray-500"
    if (color.startsWith("#")) return ""
    return `bg-${color}`
  }

  const getColorStyle = (color?: string) => {
    if (!color) return {}
    if (color.startsWith("#")) {
      return { backgroundColor: color }
    }
    return {}
  }

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Hábitos Vinculados</Label>
        <div className="text-sm text-muted-foreground">Carregando hábitos...</div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Hábitos Vinculados</Label>
        <Badge variant="outline">{selectedHabits.length} selecionados</Badge>
      </div>

      {habits.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground">
            <p>Nenhum hábito disponível para vincular</p>
            <p className="text-xs">Crie hábitos primeiro para vinculá-los às suas metas</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Selecione os hábitos que alimentam esta meta</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {habits.map((habit) => (
                  <div key={habit.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedHabits.includes(habit.id)}
                      onCheckedChange={() => toggleHabit(habit.id)}
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <div
                        className={`w-3 h-3 rounded-full ${getColorClass(habit.color)}`}
                        style={getColorStyle(habit.color)}
                      />
                      {renderIcon(habit.icon)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{habit.title}</p>
                        {habit.description && <p className="text-xs text-muted-foreground">{habit.description}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
