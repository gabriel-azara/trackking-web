"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Target, CheckCircle, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { LanguageSelector } from "@/components/language-selector";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative">
      <div className="absolute top-4 right-4 z-10">
        <LanguageSelector />
      </div>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            HabitsGoals
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t(
              "app.hero_description",
              "Transforme sua vida com gerenciamento inteligente de hábitos, metas e tarefas. Acompanhe seu progresso e conquiste seus objetivos."
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/auth/signup">
                {t("auth.signup.submit", "Get Started")}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-transparent"
            >
              <Link href="/auth/login">{t("auth.login.submit", "Login")}</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <CardTitle>{t("sidebar.habits", "Habits")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t(
                  "home.features.habits_desc",
                  "Create recurring habits with custom tracking and track streaks"
                )}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle>{t("sidebar.goals", "Goals")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t(
                  "home.features.goals_desc",
                  "Define goals with deadlines and milestones, track progress in real time"
                )}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <CardTitle>{t("sidebar.tasks", "Tasks")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t(
                  "home.features.tasks_desc",
                  "Organize one-off tasks with priorities and detailed checklists"
                )}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle>{t("sidebar.reports", "Reports")}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                {t(
                  "home.features.reports_desc",
                  "Visualize your progress with detailed charts and heatmaps"
                )}
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("home.cta.title", "Ready to start?")}
              </CardTitle>
              <CardDescription className="text-lg">
                {t(
                  "home.cta.description",
                  "Join thousands of people who have already transformed their lives"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="text-lg px-12">
                <Link href="/auth/signup">
                  {t("home.cta.button", "Create Free Account")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
