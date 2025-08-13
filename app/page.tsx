"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, CheckCircle, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">HabitsGoals</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Transforme sua vida com o gerenciamento inteligente de hábitos, metas e tarefas. Acompanhe seu progresso e
            alcance seus objetivos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">Começar Agora</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/auth/login">Fazer Login</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>Hábitos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Crie hábitos recorrentes com medição personalizada e acompanhe streaks</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>Metas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Defina objetivos com prazos e marcos, acompanhe o progresso em tempo real
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Organize tarefas pontuais com prioridades e checklists detalhados</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Visualize seu progresso com gráficos e heatmaps detalhados</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Pronto para começar?</CardTitle>
              <CardDescription className="text-lg">
                Junte-se a milhares de pessoas que já transformaram suas vidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="text-lg px-12">
                <Link href="/auth/signup">Criar Conta Gratuita</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
