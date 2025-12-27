"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  MoreHorizontal,
  Edit,
  Calendar,
  Clock,
  CheckSquare,
  AlertCircle,
  Minus,
  ArrowUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getDaysUntil, isOverdue } from "@/lib/utils/date";
import { COLORS } from "@/lib/constants";
import * as LucideIcons from "lucide-react";

interface TaskCardProps {
  task: Task;
  onToggle?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => React.ReactNode;
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const getColorStyle = (color?: string) => {
    if (!color) return {};
    const predefinedColor = COLORS.find((c) => c.value === color);
    if (predefinedColor) {
      return { backgroundColor: predefinedColor.hex };
    }
    if (color.startsWith("#")) {
      return { backgroundColor: color };
    }
    return {};
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName) return <CheckSquare className="h-5 w-5" />;

    const IconComponent = (
      LucideIcons as unknown as Record<string, React.ElementType>
    )[
      iconName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
        .replace(/[^a-zA-Z0-9]/g, "")
    ];

    if (IconComponent) {
      return <IconComponent className="h-5 w-5" />;
    }
    return <CheckSquare className="h-5 w-5" />;
  };

  const getPriorityIcon = (priority?: Task["priority"]) => {
    switch (priority) {
      case "high":
        return <ArrowUp className="h-3 w-3" />;
      case "medium":
        return <AlertCircle className="h-3 w-3" />;
      case "low":
        return <Minus className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getPriorityColor = (priority?: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "text-red-600 border-red-200";
      case "medium":
        return "text-yellow-600 border-yellow-200";
      case "low":
        return "text-green-600 border-green-200";
      default:
        return "text-gray-600 border-gray-200";
    }
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return "default";
      case "doing":
        return "secondary";
      case "todo":
        return "outline";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: Task["status"]) => {
    switch (status) {
      case "done":
        return "Concluído";
      case "doing":
        return "Em Andamento";
      case "todo":
        return "A Fazer";
      default:
        return "A Fazer";
    }
  };

  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    const days = getDaysUntil(task.dueDate);
    const overdue = isOverdue(task.dueDate);

    if (overdue)
      return { text: "Atrasado", variant: "destructive" as const, days };
    if (days === 0)
      return { text: "Hoje", variant: "secondary" as const, days };
    if (days === 1)
      return { text: "Amanhã", variant: "outline" as const, days };
    if (days <= 7)
      return { text: `${days} dias`, variant: "outline" as const, days };
    return null;
  };

  const getChecklistProgress = () => {
    if (!task.checklist || task.checklist.length === 0) return null;
    const completed = task.checklist.filter((item) => item.done).length;
    const total = task.checklist.length;
    const percentage = (completed / total) * 100;
    return { completed, total, percentage };
  };

  const dueDateStatus = getDueDateStatus();
  const checklistProgress = getChecklistProgress();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <Checkbox
              checked={task.status === "done"}
              onCheckedChange={() => onToggle && onToggle(task)}
              className="mt-1"
            />
            {task.color && (
              <div
                className={cn("w-3 h-3 rounded-full")}
                style={getColorStyle(task.color)}
              />
            )}
            <div className="flex items-center space-x-2 flex-1">
              {task.icon && renderIcon(task.icon)}
              <div className="flex-1">
                <h3
                  className={cn(
                    "font-medium",
                    task.status === "done" &&
                      "line-through text-muted-foreground"
                  )}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              )}
              {onDelete && onDelete(task)}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Checklist Progress */}
        {checklistProgress && (
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Checklist</span>
              <span>
                {checklistProgress.completed}/{checklistProgress.total}
              </span>
            </div>
            <Progress value={checklistProgress.percentage} className="h-2" />
          </div>
        )}

        {/* Badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(task.status)}>
              {getStatusLabel(task.status)}
            </Badge>

            {task.priority && (
              <Badge
                variant="outline"
                className={getPriorityColor(task.priority)}
              >
                {getPriorityIcon(task.priority)}
                <span className="ml-1 capitalize">{task.priority}</span>
              </Badge>
            )}

            {dueDateStatus && (
              <Badge variant={dueDateStatus.variant}>
                <Calendar className="h-3 w-3 mr-1" />
                {dueDateStatus.text}
              </Badge>
            )}

            {task.dueTime && (
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {task.dueTime}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
