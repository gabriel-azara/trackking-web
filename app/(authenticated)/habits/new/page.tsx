import { HabitForm } from "@/components/habits/habit-form";

export default function NewHabitPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Novo Hábito</h1>
        <p className="text-muted-foreground">
          Crie um novo hábito recorrente para acompanhar
        </p>
      </div>

      <HabitForm />
    </div>
  );
}
