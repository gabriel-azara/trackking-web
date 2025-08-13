"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { HabitCard } from "@/components/habits/habit-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Search, Filter, Target } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { subscribeToUserHabits, deleteHabit, logHabitCompletion } from "@/lib/firebase/habits"
import type { Habit, HabitLog } from "@/lib/types"
import { getToday } from "@/lib/utils/date"

export default function HabitsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [habits, setHabits] = useState<(Habit & { todayLog?: HabitLog })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "archived">("all")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToUserHabits(user.uid, (fetchedHabits) => {
      // For now, we'll simulate today's logs - in a real app, you'd fetch these from Firebase
      const habitsWithLogs = fetchedHabits.map((habit) => ({
        ...habit,
        todayLog: undefined, // This would be fetched from the habitLogs collection
      }))
      setHabits(habitsWithLogs)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const handleToggleHabit = async (habitId: string, completed: boolean, value?: number) => {
    if (!user) return

    try {
      await logHabitCompletion(user.uid, habitId, getToday(), completed, value)
      // The subscription will automatically update the UI
    } catch (error: any) {
      setError(error.message || "Erro ao atualizar hábito")
    }
  }

  const handleEditHabit = (habit: Habit) => {
    router.push(`/habits/${habit.id}/edit`)
  }

  const handleDeleteHabit = async (habit: Habit) => {
    if (!user) return

    if (confirm(`Tem certeza que deseja excluir o hábito "${habit.title}"?`)) {
      try {
        await deleteHabit(user.uid, habit.id)
      } catch (error: any) {
        setError(error.message || "Erro ao excluir hábito")
      }
    }
  }

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch =
      habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      habit.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && !habit.archive) ||
      (filterStatus === "archived" && habit.archive)

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: habits.length,
    active: habits.filter((h) => !h.archive).length,
    completed: habits.filter((h) => h.todayLog?.completed).length,
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
            <h1 className="text-3xl font-bold">Hábitos</h1>
            <p className="text-muted-foreground">Gerencie seus hábitos recorrentes</p>
          </div>
          <Button onClick={() => router.push("/habits/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Hábito
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{stats.total} Total</Badge>
            <Badge variant="outline">{stats.active} Ativos</Badge>
            <Badge variant="outline">{stats.completed} Concluídos Hoje</Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar hábitos..."
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
              <SelectItem value="all">Todos os hábitos</SelectItem>
              <SelectItem value="active">Apenas ativos</SelectItem>
              <SelectItem value="archived">Apenas arquivados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Habits List */}
        {filteredHabits.length === 0 ? (
          <div className="text-center py-12">
            <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {searchTerm || filterStatus !== "all" ? "Nenhum hábito encontrado" : "Nenhum hábito criado"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterStatus !== "all"
                ? "Tente ajustar os filtros de busca"
                : "Crie seu primeiro hábito para começar a acompanhar seu progresso"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Button onClick={() => router.push("/habits/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Hábito
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleToday={handleToggleHabit}
                onEdit={handleEditHabit}
                onDelete={handleDeleteHabit}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
