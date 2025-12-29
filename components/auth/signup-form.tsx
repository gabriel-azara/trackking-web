"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUp } from "@/lib/firebase/auth";
import { Loader2, Mail, Lock, User } from "lucide-react";

import { useTranslation } from "@/app/i18n/client";
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export function SignupForm() {
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError(t("auth.signup.passwords_mismatch", "As senhas não coincidem"));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(
        t(
          "auth.signup.password_length",
          "A senha deve ter pelo menos 6 caracteres"
        )
      );
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, name);
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : t("auth.signup.error", "Erro ao criar conta")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {t("auth.signup.title", "Criar Conta")}
        </CardTitle>
        <CardDescription className="text-center">
          {t(
            "auth.signup.description",
            "Crie sua conta para começar a gerenciar seus hábitos e metas"
          )}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">{t("auth.signup.name", "Nome")}</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder={t("auth.signup.name_placeholder", "Seu nome")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.login.email", "Email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {t("auth.login.password", "Senha")}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2 mb-2">
            <Label htmlFor="confirmPassword">
              {t("auth.signup.confirm_password", "Confirmar Senha")}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("auth.signup.submit", "Criar Conta")}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            {t("auth.signup.has_account", "Já tem uma conta?")}{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              {t("auth.signup.login_link", "Faça login")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
