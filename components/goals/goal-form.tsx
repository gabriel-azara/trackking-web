"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ColorPicker } from "../habits/color-picker";
import { IconPicker } from "../habits/icon-picker";
import { UnitSelect } from "../habits/unit-select";
import { MilestoneManager } from "./milestone-manager";
import type { Goal } from "@/lib/types";
import { createGoal, updateGoal } from "@/lib/firebase/goals";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

interface GoalFormProps {
  goal?: Goal;
  onSuccess?: () => void;
}

export function GoalForm({ goal, onSuccess }: GoalFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: goal?.title || "",
    description: goal?.description || "",
    color: goal?.color || "green-500",
    icon: goal?.icon || "trending-up",
    deadline: goal?.deadline || "",
    isQuantitative: Boolean(goal?.unit && goal?.targetValue),
    unit: goal?.unit || "times",
    targetValue: goal?.targetValue || 1,
    progressValue: goal?.progressValue || 0,
    milestones: goal?.milestones || [],
    linkedHabits: goal?.linkedHabits || [],
  });

  // Basic validation: title is required; if quantitative, unit and targetValue (>=1) are required
  const isValid =
    formData.title.trim().length > 0 &&
    (!formData.isQuantitative ||
      (formData.unit &&
        Number.isFinite(formData.targetValue) &&
        formData.targetValue >= 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Block submit if invalid
    if (!isValid) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const goalData = {
        title: formData.title,
        description: formData.description || undefined,
        color: formData.color,
        icon: formData.icon,
        deadline: formData.deadline || undefined,
        unit: formData.isQuantitative ? formData.unit : undefined,
        targetValue: formData.isQuantitative ? formData.targetValue : undefined,
        progressValue: formData.progressValue,
        milestones:
          formData.milestones.length > 0 ? formData.milestones : undefined,
        linkedHabits:
          formData.linkedHabits.length > 0 ? formData.linkedHabits : undefined,
        type: "goal" as const,
      };

      if (goal) {
        await updateGoal(user.uid, goal.id, goalData);
      } else {
        await createGoal(user.uid, goalData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/goals");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao salvar meta");
    } finally {
      setLoading(false);
    }
  };

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
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Ler 12 livros, Economizar R$ 10.000, Correr uma maratona"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descreva sua meta e como pretende alcançá-la (opcional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              value={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
            />
            <IconPicker
              value={formData.icon}
              onChange={(icon) => setFormData({ ...formData, icon })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Prazo Final</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipo de Meta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.isQuantitative}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isQuantitative: checked })
              }
            />
            <Label>Meta quantitativa (com valor alvo numérico)</Label>
          </div>

          {formData.isQuantitative && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <UnitSelect
                value={formData.unit}
                onChange={(unit) => setFormData({ ...formData, unit })}
              />
              <div className="space-y-2">
                <Label htmlFor="targetValue">Valor Alvo *</Label>
                <Input
                  id="targetValue"
                  type="number"
                  min="1"
                  value={formData.targetValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetValue: Number.parseFloat(e.target.value) || 1,
                    })
                  }
                  placeholder="Ex: 12, 10000, 42"
                  required={formData.isQuantitative}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="progressValue">Progresso Atual</Label>
                <Input
                  id="progressValue"
                  type="number"
                  min="0"
                  value={formData.progressValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progressValue: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marcos (Milestones)</CardTitle>
        </CardHeader>
        <CardContent>
          <MilestoneManager
            milestones={formData.milestones}
            onChange={(milestones) => setFormData({ ...formData, milestones })}
            unit={formData.isQuantitative ? formData.unit : undefined}
          />
        </CardContent>
      </Card>

      {/* Habit linking temporarily disabled */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Hábitos Vinculados</CardTitle>
        </CardHeader>
        <CardContent>
          <HabitSelector
            selectedHabits={formData.linkedHabits}
            onChange={(linkedHabits) =>
              setFormData({ ...formData, linkedHabits })
            }
          />
        </CardContent>
      </Card> */}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || !isValid}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {goal ? "Atualizar Meta" : "Criar Meta"}
        </Button>
      </div>
    </form>
  );
}
