"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { GoalCard } from "@/components/goals/goal-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Filter, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { subscribeToUserGoals, deleteGoal } from "@/lib/firebase/goals"
import type { Goal } from "@/lib/types"
import { isOverdue } from "@/lib/utils/date"

export default function GoalsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed" | "overdue">("all")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUserGoals(user.uid, (fetchedGoals) => {
      setGoals(fetchedGoals)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const handleEditGoal = (goal: Goal) => {
    router.push(`/goals/${goal.id}/edit`)
  }

  const handleDeleteGoal = async (goal: Goal) => {
    if (!user) return

    if (confirm(`Tem certeza que deseja excluir a meta "${goal.title}"?`)) {
      try {
        await deleteGoal(user.uid, goal.id)
      } catch (error: any) {
        setError(error.message || "Erro ao excluir meta")
      }
    }
  }

  const getGoalProgress = (goal: Goal) => {
    if (!goal.targetValue || !goal.progressValue) return 0
    return Math.min((goal.progressValue / goal.targetValue) * 100, 100)
  }

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const progress = getGoalProgress(goal)
    const overdue = goal.deadline ? isOverdue(goal.deadline) : false

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && progress < 100 && !overdue) ||
      (filterStatus === "completed" && progress >= 100) ||
      (filterStatus === "overdue" && overdue)

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: goals.length,
    active: goals.filter((g) => getGoalProgress(g) < 100 && !isOverdue(g.deadline || "")).length,
    completed: goals.filter((g) => getGoalProgress(g) >= 100).length,
    overdue: goals.filter((g) => g.deadline && isOverdue(g.deadline)).length,
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Metas</h1>
            <p className="text-muted-foreground">Gerencie seus objetivos e acompanhe o progresso</p>
          </div>
          <Button onClick={() => router.push("/goals/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Meta
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Badge variant="outline" className="p-2 justify-center">
            {stats.total} Total
          </Badge>
          <Badge variant="outline" className="p-2 justify-center">
            {stats.active} Ativas
          </Badge>
          <Badge variant="outline" className="p-2 justify-center">
            {stats.completed} Concluídas
          </Badge>
          <Badge variant="outline" className="p-2 justify-center">
            {stats.overdue} Atrasadas
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar metas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as metas</SelectItem>
              <SelectItem value="active">Apenas ativas</SelectItem>
              <SelectItem value="completed">Apenas concluídas</SelectItem>
              <SelectItem value="overdue">Apenas atrasadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Goals List */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm || filterStatus !== "all" ? "Nenhuma meta encontrada" : "Nenhuma meta criada"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Crie sua primeira meta para começar a acompanhar seus objetivos"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Button onClick={() => router.push("/goals/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Meta
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onEdit={handleEditGoal} onDelete={handleDeleteGoal} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
