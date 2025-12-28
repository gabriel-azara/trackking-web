"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TodayHabits } from "@/components/dashboard/today-habits";
import { GoalsOverview } from "@/components/dashboard/goals-overview";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { subscribeToUserHabits } from "@/lib/firebase/habits";
import { subscribeToUserGoals } from "@/lib/firebase/goals";
import { logHabitCompletion } from "@/lib/firebase/habits";
import type { Habit, Goal, HabitLog } from "@/lib/types";
import { getToday } from "@/lib/utils/date";

export default function DashboardPage() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<(Habit & { todayLog?: HabitLog })[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribeHabits = subscribeToUserHabits(
      user.uid,
      (fetchedHabits) => {
        // For now, we'll simulate today's logs - in a real app, you'd fetch these from Firebase
        const habitsWithLogs = fetchedHabits.map((habit) => ({
          ...habit,
          todayLog: undefined, // This would be fetched from the habitLogs collection
        }));
        setHabits(habitsWithLogs);
        setLoading(false);
      }
    );

    const unsubscribeGoals = subscribeToUserGoals(user.uid, (fetchedGoals) => {
      setGoals(fetchedGoals);
    });

    return () => {
      unsubscribeHabits();
      unsubscribeGoals();
    };
  }, [user]);

  const handleToggleHabit = async (
    habitId: string,
    completed: boolean,
    value?: number
  ) => {
    if (!user) return;

    try {
      await logHabitCompletion(user.uid, habitId, getToday(), completed, value);
      // The subscription will automatically update the UI
    } catch (error) {
      console.error("Error toggling habit:", error);
    }
  };

  const stats = {
    habitsToday: habits.length,
    habitsCompleted: habits.filter((h) => h.todayLog?.completed).length,
    activeGoals: goals.length,
    currentStreak: 5, // This would be calculated from habit logs
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso e gerencie suas atividades
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodayHabits habits={habits} onToggleHabit={handleToggleHabit} />
        </div>
        <div className="space-y-6">
          <GoalsOverview goals={goals} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
