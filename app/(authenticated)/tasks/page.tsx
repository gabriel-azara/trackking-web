"use client";

import { useRouter } from "next/navigation";
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
import { ConfirmationModal } from "@/components/modal";
import { useTasks } from "@/hooks/use-tasks";
import { Task } from "@/lib/types";

export default function TasksPage() {
  const router = useRouter();
  const {
    loading: isLoading,
    error,
    searchTerm,
    setSearchTerm,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    toggleTask,
    removeTask,
    getFilteredTasks,
    stats,
  } = useTasks();

  const handleEditTask = (task: Task) => {
    router.push(`/tasks/${task.id}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
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
          onValueChange={(value) =>
            setFilterPriority(value as "all" | "high" | "medium" | "low")
          }
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
          onValueChange={(value) =>
            setFilterStatus(value as "all" | "todo" | "doing" | "done")
          }
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
            Todas ({getFilteredTasks("all").length})
          </TabsTrigger>
          <TabsTrigger value="today">
            Hoje ({getFilteredTasks("today").length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Próximas ({getFilteredTasks("upcoming").length})
          </TabsTrigger>
        </TabsList>

        {["all", "today", "upcoming"].map((view) => (
          <TabsContent key={view} value={view} className="mt-6">
            {getFilteredTasks(view as "all" | "today" | "upcoming").length ===
            0 ? (
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
                {getFilteredTasks(view as "all" | "today" | "upcoming").map(
                  (task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onEdit={handleEditTask}
                      onDelete={(task) => (
                        <ConfirmationModal
                          title="Tem certeza absoluta?"
                          description={`Esta ação não pode ser desfeita. Isso irá permanentemente deletar a tarefa "${task.title}" e remover todos os seus dados.`}
                          confirmText="DELETAR"
                          confirmLabel="Deletar tarefa"
                          onConfirm={() => removeTask(task)}
                        >
                          <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-destructive w-full gap-2">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </div>
                        </ConfirmationModal>
                      )}
                    />
                  )
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
