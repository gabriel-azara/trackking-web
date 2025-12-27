import { AppLayout } from "@/components/layout/app-layout"
import { GoalForm } from "@/components/goals/goal-form"

export default function NewGoalPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Nova Meta</h1>
          <p className="text-muted-foreground">Defina um novo objetivo para acompanhar seu progresso</p>
        </div>

        <GoalForm />
      </div>
    </AppLayout>
  )
}
