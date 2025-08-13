"use client";

import { useMemo } from "react";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface HabitHeatmapProps {
  data: Array<{
    date: string;
    completed: number;
    total: number;
  }>;
  className?: string;
}

export function HabitHeatmap({ data, className }: HabitHeatmapProps) {
  const heatmapData = useMemo(() => {
    const today = new Date();
    const startDate = startOfMonth(
      new Date(today.getFullYear(), today.getMonth() - 2, 1)
    );
    const endDate = endOfMonth(today);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dayData = data.find((d) => d.date === dateStr);
      const completionRate = dayData ? dayData.completed / dayData.total : 0;

      return {
        date: day,
        completionRate,
        level:
          completionRate === 0
            ? 0
            : completionRate < 0.25
            ? 1
            : completionRate < 0.5
            ? 2
            : completionRate < 0.75
            ? 3
            : 4,
      };
    });
  }, [data]);

  const weeks = useMemo(() => {
    const result: { date: Date; completionRate: number; level: number }[][] = [];
    let currentWeek: { date: Date; completionRate: number; level: number }[] = [];

    heatmapData.forEach((day, index) => {
      if (index === 0) {
        // Preencher dias vazios no início da primeira semana
        const dayOfWeek = day.date.getDay();
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: new Date(), completionRate: 0, level: 0 });
        }
      }

      currentWeek.push(day);

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [heatmapData]);

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-muted";
      case 1:
        return "bg-green-200";
      case 2:
        return "bg-green-300";
      case 3:
        return "bg-green-400";
      case 4:
        return "bg-green-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mapa de Calor dos Hábitos</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>Menos</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={cn("w-3 h-3 rounded-sm", getLevelColor(level))}
              />
            ))}
          </div>
          <span>Mais</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={cn("w-4 h-4 rounded-sm", getLevelColor(day.level))}
                title={`${format(day.date, "dd/MM/yyyy", {
                  locale: ptBR,
                })}: ${Math.round(day.completionRate * 100)}% concluído`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
