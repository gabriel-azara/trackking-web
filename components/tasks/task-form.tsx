"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ColorPicker } from "../habits/color-picker";
import { IconPicker } from "../habits/icon-picker";
import { PrioritySelect } from "./priority-select";
import { ChecklistManager } from "./checklist-manager";
import { GoalProjectSelector } from "./goal-project-selector";
import { TimeList } from "../habits/time-list";
import type { Task } from "@/lib/types";
import { createTask, updateTask } from "@/lib/firebase/tasks";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    color: string;
    icon: string;
    dueDate: string;
    dueTime: string;
    priority: Task["priority"];
    status: Task["status"];
    goalId: string | undefined;
    projectId: string | undefined;
    reminders: string[];
    checklist: NonNullable<Task["checklist"]>;
  }>({
    title: task?.title || "",
    description: task?.description || "",
    color: task?.color || "blue-500",
    icon: task?.icon || "check-square",
    dueDate: task?.dueDate || "",
    dueTime: task?.dueTime || "",
    priority: task?.priority || "medium",
    status: task?.status || "todo",
    goalId: task?.goalId || undefined,
    projectId: task?.projectId || undefined,
    reminders: task?.reminders || [],
    checklist: task?.checklist || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const taskData = {
        title: formData.title,
        description: formData.description || undefined,
        color: formData.color || undefined,
        icon: formData.icon || undefined,
        dueDate: formData.dueDate || undefined,
        dueTime: formData.dueTime || undefined,
        priority: formData.priority,
        status: formData.status,
        goalId: formData.goalId || undefined,
        projectId: formData.projectId || undefined,
        reminders:
          formData.reminders.length > 0 ? formData.reminders : undefined,
        checklist:
          formData.checklist.length > 0 ? formData.checklist : undefined,
        type: "task" as const,
      };

      if (task) {
        await updateTask(user.uid, task.id, taskData);
      } else {
        await createTask(user.uid, taskData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/tasks");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao salvar tarefa"
      );
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
              placeholder="Ex: Comprar ingredientes, Revisar relatório, Ligar para cliente"
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
              placeholder="Descreva os detalhes da tarefa (opcional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              value={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
              label="Cor (opcional)"
            />
            <IconPicker
              value={formData.icon}
              onChange={(icon) => setFormData({ ...formData, icon })}
              label="Ícone (opcional)"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prazo e Prioridade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime">Horário</Label>
              <Input
                id="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={(e) =>
                  setFormData({ ...formData, dueTime: e.target.value })
                }
              />
            </div>
          </div>

          <PrioritySelect
            value={formData.priority}
            onChange={(priority) => setFormData({ ...formData, priority })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ChecklistManager
            checklist={formData.checklist}
            onChange={(checklist) => setFormData({ ...formData, checklist })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vinculações</CardTitle>
        </CardHeader>
        <CardContent>
          <GoalProjectSelector
            goalId={formData.goalId}
            projectId={formData.projectId}
            onGoalChange={(goalId) => setFormData({ ...formData, goalId })}
            onProjectChange={(projectId) =>
              setFormData({ ...formData, projectId })
            }
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lembretes</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeList
            value={formData.reminders}
            onChange={(reminders) => setFormData({ ...formData, reminders })}
            addLabel="Adicionar lembrete"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {task ? "Atualizar Tarefa" : "Criar Tarefa"}
        </Button>
      </div>
    </form>
  );
}
