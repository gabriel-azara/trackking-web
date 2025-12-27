import { useState, useEffect } from "react";
import {
  subscribeToUserTasks,
  deleteTask,
  updateTask,
} from "@/lib/firebase/tasks";
import type { Task } from "@/lib/types";
import { getToday, isOverdue } from "@/lib/utils/date";
import { useAuth } from "@/contexts/auth-context";

export function useTasks() {
  const { user } = useAuth();
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

  const toggleTask = async (task: Task) => {
    if (!user) return;

    try {
      const newStatus = task.status === "done" ? "todo" : "done";
      await updateTask(user.uid, task.id, { status: newStatus });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao atualizar tarefa"
      );
    }
  };

  const removeTask = async (task: Task) => {
    if (!user) return;

    try {
      await deleteTask(user.uid, task.id);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao excluir tarefa"
      );
    }
  };

  const getFilteredTasks = (view: "all" | "today" | "upcoming") => {
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

  return {
    tasks,
    loading,
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
  };
}
