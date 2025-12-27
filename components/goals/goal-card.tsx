"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Target,
  Link,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Goal } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getDaysUntil, isOverdue } from "@/lib/utils/date";
import * as LucideIcons from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (goal: Goal) => React.ReactNode;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const getGoalProgress = () => {
    if (!goal.targetValue || !goal.progressValue) return 0;
    return Math.min((goal.progressValue / goal.targetValue) * 100, 100);
  };

  const getColorStyle = (color?: string) => {
    if (!color) return {};
    if (color.startsWith("#")) {
      return { backgroundColor: color };
    }
    return {};
  };

  const getColorClass = (color?: string) => {
    if (!color) return "bg-gray-500";
    if (color.startsWith("#")) return "";
    return `bg-${color}`;
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName) return <LucideIcons.TrendingUp className="h-5 w-5" />;

    const IconComponent = (LucideIcons as any)[
      iconName
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("")
        .replace(/[^a-zA-Z0-9]/g, "")
    ];

    if (IconComponent) {
      return <IconComponent className="h-5 w-5" />;
    }
    return <LucideIcons.TrendingUp className="h-5 w-5" />;
  };

  const getDeadlineStatus = () => {
    if (!goal.deadline) return null;
    const days = getDaysUntil(goal.deadline);
    const overdue = isOverdue(goal.deadline);

    if (overdue)
      return { text: "Atrasado", variant: "destructive" as const, days };
    if (days <= 7)
      return { text: `${days} dias`, variant: "secondary" as const, days };
    return { text: `${days} dias`, variant: "outline" as const, days };
  };

  const progress = getGoalProgress();
  const deadlineStatus = getDeadlineStatus();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div
              className={cn("w-3 h-3 rounded-full", getColorClass(goal.color))}
              style={getColorStyle(goal.color)}
            />
            <div className="flex items-center space-x-2">
              {renderIcon(goal.icon)}
              <div>
                <h3 className="font-medium">{goal.title}</h3>
                {goal.description && (
                  <p className="text-sm text-muted-foreground">
                    {goal.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {deadlineStatus && (
              <Badge variant={deadlineStatus.variant}>
                <Calendar className="h-3 w-3 mr-1" />
                {deadlineStatus.text}
              </Badge>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(goal)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem asChild className="text-destructive">
                    {onDelete(goal)}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          {goal.targetValue && goal.unit && (
            <div className="text-xs text-muted-foreground">
              {goal.progressValue || 0} / {goal.targetValue} {goal.unit}
            </div>
          )}
        </div>

        {/* Milestones */}
        {goal.milestones && goal.milestones.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {goal.milestones.length} marcos
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {goal.milestones.slice(0, 3).map((milestone, index) => (
                <Badge key={milestone.id} variant="outline" className="text-xs">
                  {milestone.title}
                </Badge>
              ))}
              {goal.milestones.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{goal.milestones.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Linked Habits */}
        {goal.linkedHabits && goal.linkedHabits.length > 0 && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Link className="h-3 w-3" />
            <span>{goal.linkedHabits.length} hábitos vinculados</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
