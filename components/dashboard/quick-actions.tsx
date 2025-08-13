"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, TrendingUp, CheckSquare, BarChart3 } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Novo Hábito",
      description: "Criar um novo hábito recorrente",
      icon: Target,
      href: "/habits/new",
      color: "text-blue-600",
    },
    {
      title: "Nova Meta",
      description: "Definir uma nova meta com prazo",
      icon: TrendingUp,
      href: "/goals/new",
      color: "text-green-600",
    },
    {
      title: "Nova Tarefa",
      description: "Adicionar uma tarefa pontual",
      icon: CheckSquare,
      href: "/tasks/new",
      color: "text-purple-600",
    },
    {
      title: "Ver Relatórios",
      description: "Acompanhar seu progresso",
      icon: BarChart3,
      href: "/reports",
      color: "text-orange-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {actions.map((action) => (
          <Button key={action.title} variant="outline" className="h-auto p-4 justify-start bg-transparent" asChild>
            <a href={action.href}>
              <div className="flex items-center space-x-3">
                <action.icon className={`h-5 w-5 ${action.color}`} />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </div>
            </a>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
