"use client";

import { LoginForm } from "@/components/auth/login-form";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslation } from "@/app/i18n/client";

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            HabitsGoals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("app.subtitle", "Gerencie seus hábitos, metas e tarefas")}
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
