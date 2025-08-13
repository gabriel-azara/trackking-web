import { AppLayout } from "@/components/layout/app-layout"
import { TaskForm } from "@/components/tasks/task-form"

export default function NewTaskPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Nova Tarefa</h1>
          <p className="text-muted-foreground">Crie uma nova tarefa para organizar suas atividades</p>
        </div>

        <TaskForm />
      </div>
    </AppLayout>
  )
}
