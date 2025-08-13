export type ID = string;
export type HexColor = `#${string}`;
export type TailwindColor = string; // ex.: "violet-500"
export type ColorToken = HexColor | TailwindColor;

export type Unit =
  | "times"
  | "min"
  | "hours"
  | "pages"
  | "km"
  | "m"
  | "steps"
  | "ml"
  | "L"
  | "kg"
  | "g"
  | "%"
  | "pomodoros"
  | "money";

export type Frequency =
  | { kind: "daily"; times?: number }
  | { kind: "weekly"; days: number[] } // 0=Dom ... 6=Sáb
  | { kind: "monthly"; dates: number[] } // dias do mês
  | { kind: "custom"; rrule: string };

export interface BaseEntity {
  id: ID;
  userId: ID;
  title: string;
  description?: string;
  color?: ColorToken;
  icon?: string; // chave do ícone
  createdAt: number; // epoch ms
  updatedAt: number; // epoch ms
}

export interface Habit extends BaseEntity {
  type: "habit";
  frequency: Frequency;
  unit?: Unit; // se quantitativo
  target?: number; // alvo por ocorrência (ex.: 2000 ml)
  timezone?: string;
  remindAt?: string[]; // "08:00", "20:00"
  archive?: boolean;
}

export interface HabitLog {
  id: ID;
  habitId: ID;
  date: string; // YYYY-MM-DD na timezone do usuário
  value?: number; // se quantitativo
  completed: boolean;
  createdAt: number;
}

export interface Goal extends BaseEntity {
  type: "goal";
  deadline?: string; // YYYY-MM-DD
  unit?: Unit;
  targetValue?: number; // p/ metas quantitativas
  milestones?: { id: ID; title: string; value?: number; deadline?: string }[];
  progressValue?: number; // acumulado atual
  linkedHabits?: ID[]; // hábitos que alimentam a meta
}

export interface Task extends BaseEntity {
  type: "task";
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority?: "low" | "medium" | "high";
  status: "todo" | "doing" | "done";
  goalId?: ID; // relacionamento opcional
  projectId?: ID;
  reminders?: string[]; // horários
  checklist?: { id: ID; text: string; done: boolean }[];
}

export interface UserProfile {
  id: ID;
  name?: string;
  email: string;
  bio: string;
  avatar: string; // URL da imagem
  timezone: string;
  preferredUnits?: Unit[];
  theme?: "light" | "dark" | "system";
  language?: "pt-BR" | "en";
}

// Utility types for UI components
export interface HabitWithProgress extends Habit {
  todayLog?: HabitLog;
  currentStreak: number;
  bestStreak: number;
}

export interface GoalWithProgress extends Goal {
  progressPercentage: number;
  isOverdue: boolean;
  daysUntilDeadline?: number;
}
