"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ColorPicker } from "./color-picker"
import { IconPicker } from "./icon-picker"
import { FrequencyPicker } from "./frequency-picker"
import { UnitSelect } from "./unit-select"
import { TimeList } from "./time-list"
import type { Habit } from "@/lib/types"
import { createHabit, updateHabit } from "@/lib/firebase/habits"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface HabitFormProps {
  habit?: Habit
  onSuccess?: () => void
}

export function HabitForm({ habit, onSuccess }: HabitFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: habit?.title || "",
    description: habit?.description || "",
    color: habit?.color || "blue-500",
    icon: habit?.icon || "target",
    frequency: habit?.frequency || { kind: "daily" as const },
    isQuantitative: Boolean(habit?.unit && habit?.target),
    unit: habit?.unit || "times",
    target: habit?.target || 1,
    remindAt: habit?.remindAt || [],
    timezone: habit?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  })

  // Basic validation: title is required; if quantitative, unit and target (>=1) are required
  const isValid =
    formData.title.trim().length > 0 &&
    (!formData.isQuantitative || (formData.unit && Number.isFinite(formData.target) && formData.target >= 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Block submit if invalid
    if (!isValid) {
      setError("Preencha todos os campos obrigatórios.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const habitData = {
        title: formData.title.trim(),
        description: formData.description?.trim() || undefined,
        color: formData.color,
        icon: formData.icon,
        frequency: formData.frequency,
        unit: formData.isQuantitative ? formData.unit : undefined,
        target: formData.isQuantitative ? formData.target : undefined,
        remindAt: formData.remindAt.length > 0 ? formData.remindAt : undefined,
        timezone: formData.timezone,
        type: "habit" as const,
      }

      if (habit) {
        await updateHabit(user.uid, habit.id, habitData)
      } else {
        await createHabit(user.uid, habitData)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/habits")
      }
    } catch (error: any) {
      setError(error.message || "Erro ao salvar hábito")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Beber água, Exercitar-se, Ler"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva seu hábito (opcional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker value={formData.color} onChange={(color) => setFormData({ ...formData, color })} />
            <IconPicker value={formData.icon} onChange={(icon) => setFormData({ ...formData, icon })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isQuantitative}
              onCheckedChange={(checked) => setFormData({ ...formData, isQuantitative: checked })}
            />
            <Label>Hábito quantitativo (com meta numérica)</Label>
          </div>

          {formData.isQuantitative && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UnitSelect value={formData.unit} onChange={(unit) => setFormData({ ...formData, unit })} />
              <div className="space-y-2">
                <Label htmlFor="target">Meta por ocorrência *</Label>
                <Input
                  id="target"
                  type="number"
                  min="1"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: Number.parseInt(e.target.value) || 1 })}
                  placeholder="Ex: 2000 (ml), 30 (min), 10 (páginas)"
                  required={formData.isQuantitative}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Frequência</CardTitle>
        </CardHeader>
        <CardContent>
          <FrequencyPicker
            value={formData.frequency}
            onChange={(frequency) => setFormData({ ...formData, frequency })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lembretes</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeList
            value={formData.remindAt}
            onChange={(remindAt) => setFormData({ ...formData, remindAt })}
            addLabel="Adicionar lembrete"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || !isValid}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {habit ? "Atualizar Hábito" : "Criar Hábito"}
        </Button>
      </div>
    </form>
  )
}
