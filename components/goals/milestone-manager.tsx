"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Calendar, Target } from "lucide-react"

interface Milestone {
  id: string
  title: string
  value?: number
  deadline?: string
}

interface MilestoneManagerProps {
  milestones: Milestone[]
  onChange: (milestones: Milestone[]) => void
  unit?: string
}

export function MilestoneManager({ milestones, onChange, unit }: MilestoneManagerProps) {
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    value: "",
    deadline: "",
  })

  const addMilestone = () => {
    if (!newMilestone.title.trim()) return

    const milestone: Milestone = {
      id: Date.now().toString(),
      title: newMilestone.title,
      value: newMilestone.value ? Number.parseFloat(newMilestone.value) : undefined,
      deadline: newMilestone.deadline || undefined,
    }

    onChange([...milestones, milestone])
    setNewMilestone({ title: "", value: "", deadline: "" })
  }

  const removeMilestone = (id: string) => {
    onChange(milestones.filter((m) => m.id !== id))
  }

  const updateMilestone = (id: string, updates: Partial<Milestone>) => {
    onChange(milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Marcos (Milestones)</Label>
        <Badge variant="outline">{milestones.length} marcos</Badge>
      </div>

      {/* Add New Milestone */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Adicionar Marco</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Título *</Label>
              <Input
                placeholder="Ex: Primeira etapa"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Valor {unit && `(${unit})`}</Label>
              <Input
                type="number"
                placeholder="Ex: 5"
                value={newMilestone.value}
                onChange={(e) => setNewMilestone({ ...newMilestone, value: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Prazo</Label>
              <Input
                type="date"
                value={newMilestone.deadline}
                onChange={(e) => setNewMilestone({ ...newMilestone, deadline: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addMilestone} size="sm" className="w-full" disabled={!newMilestone.title.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Marco
          </Button>
        </CardContent>
      </Card>

      {/* Existing Milestones */}
      {milestones.length > 0 && (
        <div className="space-y-3">
          {milestones.map((milestone, index) => (
            <Card key={milestone.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <Input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                        className="font-medium border-none p-0 h-auto focus-visible:ring-0"
                      />
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {milestone.value && (
                        <div className="flex items-center space-x-1">
                          <Target className="h-3 w-3" />
                          <span>
                            {milestone.value} {unit}
                          </span>
                        </div>
                      )}
                      {milestone.deadline && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(milestone.deadline).toLocaleDateString("pt-BR")}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button variant="ghost" size="icon" onClick={() => removeMilestone(milestone.id)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
