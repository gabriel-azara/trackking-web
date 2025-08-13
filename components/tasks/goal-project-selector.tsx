"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { subscribeToUserGoals } from "@/lib/firebase/goals"
import type { Goal } from "@/lib/types"
import { TrendingUp, Folder } from "lucide-react"

interface GoalProjectSelectorProps {
  goalId?: string
  projectId?: string
  onGoalChange: (goalId?: string) => void
  onProjectChange: (projectId?: string) => void
}

export function GoalProjectSelector({ goalId, projectId, onGoalChange, onProjectChange }: GoalProjectSelectorProps) {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUserGoals(user.uid, (fetchedGoals) => {
      setGoals(fetchedGoals)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const selectedGoal = goals.find((g) => g.id === goalId)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Vincular à Meta</Label>
        <Select value={goalId || "none"} onValueChange={(value) => onGoalChange(value === "none" ? undefined : value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecionar meta (opcional)">
              {selectedGoal && (
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{selectedGoal.title}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhuma meta</SelectItem>
            {goals.map((goal) => (
              <SelectItem key={goal.id} value={goal.id}>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>{goal.title}</span>
                  {goal.deadline && (
                    <Badge variant="outline" className="text-xs">
                      {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Vincular ao Projeto</Label>
        <Select
          value={projectId || "none"}
          onValueChange={(value) => onProjectChange(value === "none" ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecionar projeto (opcional)">
              {projectId && (
                <div className="flex items-center space-x-2">
                  <Folder className="h-4 w-4" />
                  <span>Projeto {projectId}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Nenhum projeto</SelectItem>
            {/* Projects would be loaded here - for now showing placeholder */}
            <SelectItem value="project-1">
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4" />
                <span>Projeto Exemplo</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
