"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { TaskCard } from "@/components/tasks/task-card";
import { QuickTaskInput } from "@/components/tasks/quick-task-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  Calendar,
  Clock,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import {
  subscribeToUserTasks,
  deleteTask,
  updateTask,
} from "@/lib/firebase/tasks";
import type { Task } from "@/lib/types";
import { getToday, isOverdue } from "@/lib/utils/date";
import { ConfirmationModal } from "@/components/modal";

export default function TasksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "high" | "medium" | "low"
  >("all");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "todo" | "doing" | "done"
  >("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserTasks(user.uid, (fetchedTasks) => {
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleToggleTask = async (task: Task) => {
    if (!user) return;

    try {
      const newStatus = task.status === "done" ? "todo" : "done";
      await updateTask(user.uid, task.id, { status: newStatus });
    } catch (error: any) {
      setError(error.message || "Erro ao atualizar tarefa");
    }
  };

  const handleEditTask = (task: Task) => {
    router.push(`/tasks/${task.id}/edit`);
  };

  const handleDeleteTask = async (task: Task) => {
    if (!user) return;

    try {
      await deleteTask(user.uid, task.id);
    } catch (error: any) {
      setError(error.message || "Erro ao excluir tarefa");
    }
  };

  const filterTasks = (tasks: Task[], view: "all" | "today" | "upcoming") => {
    const filtered = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;
      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;

      return matchesSearch && matchesPriority && matchesStatus;
    });

    switch (view) {
      case "today":
        return filtered.filter(
          (task) => task.dueDate === getToday() || task.status === "doing"
        );
      case "upcoming":
        return filtered.filter(
          (task) => task.dueDate && task.dueDate > getToday()
        );
      default:
        return filtered;
    }
  };

  const getTasksByView = (view: "all" | "today" | "upcoming") => {
    return filterTasks(tasks, view);
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    doing: tasks.filter((t) => t.status === "doing").length,
    done: tasks.filter((t) => t.status === "done").length,
    overdue: tasks.filter(
      (t) => t.dueDate && isOverdue(t.dueDate) && t.status !== "done"
    ).length,
    today: tasks.filter((t) => t.dueDate === getToday() && t.status !== "done")
      .length,
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tarefas</h1>
            <p className="text-muted-foreground">
              Gerencie suas tarefas e projetos
            </p>
          </div>
          <Button onClick={() => router.push("/tasks/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Task Input */}
        <QuickTaskInput onTaskCreated={() => {}} />

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-6">
          <Badge variant="outline" className="p-2 justify-center">
            {stats.total} Total
          </Badge>
          <Badge variant="outline" className="p-2 justify-center">
            {stats.todo} A Fazer
          </Badge>
          <Badge variant="outline" className="p-2 justify-center">
            {stats.doing} Fazendo
          </Badge>
          <Badge variant="outline" className="p-2 justify-center">
            {stats.done} Concluídas
          </Badge>
          <Badge variant="outline" className="p-2 justify-center">
            <Calendar className="h-3 w-3 mr-1" />
            {stats.today} Hoje
          </Badge>
          <Badge variant="outline" className="p-2 justify-center">
            <Clock className="h-3 w-3 mr-1" />
            {stats.overdue} Atrasadas
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={filterPriority}
            onValueChange={(value: any) => setFilterPriority(value)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas prioridades</SelectItem>
              <SelectItem value="high">Alta prioridade</SelectItem>
              <SelectItem value="medium">Média prioridade</SelectItem>
              <SelectItem value="low">Baixa prioridade</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(value: any) => setFilterStatus(value)}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="todo">A fazer</SelectItem>
              <SelectItem value="doing">Em andamento</SelectItem>
              <SelectItem value="done">Concluídas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              Todas ({getTasksByView("all").length})
            </TabsTrigger>
            <TabsTrigger value="today">
              Hoje ({getTasksByView("today").length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Próximas ({getTasksByView("upcoming").length})
            </TabsTrigger>
          </TabsList>

          {["all", "today", "upcoming"].map((view) => (
            <TabsContent key={view} value={view} className="mt-6">
              {getTasksByView(view as any).length === 0 ? (
                <div className="text-center py-12">
                  <CheckSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    {searchTerm ||
                    filterPriority !== "all" ||
                    filterStatus !== "all"
                      ? "Nenhuma tarefa encontrada"
                      : view === "today"
                      ? "Nenhuma tarefa para hoje"
                      : view === "upcoming"
                      ? "Nenhuma tarefa próxima"
                      : "Nenhuma tarefa criada"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ||
                    filterPriority !== "all" ||
                    filterStatus !== "all"
                      ? "Tente ajustar os filtros de busca"
                      : "Crie sua primeira tarefa para começar a organizar suas atividades"}
                  </p>
                  {!searchTerm &&
                    filterPriority === "all" &&
                    filterStatus === "all" &&
                    view === "all" && (
                      <Button onClick={() => router.push("/tasks/new")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Primeira Tarefa
                      </Button>
                    )}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {getTasksByView(view as any).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={handleToggleTask}
                      onEdit={handleEditTask}
                      onDelete={(task) => (
                        <ConfirmationModal
                          title="Tem certeza absoluta?"
                          description={`Esta ação não pode ser desfeita. Isso irá permanentemente deletar a tarefa "${task.title}" e remover todos os seus dados.`}
                          confirmText="DELETAR"
                          confirmLabel="Deletar tarefa"
                          onConfirm={() => handleDeleteTask(task)}
                        >
                          <div className="flex items-center w-full text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </div>
                        </ConfirmationModal>
                      )}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}
