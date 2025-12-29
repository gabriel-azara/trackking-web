"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Save } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useTranslation } from "@/app/i18n/client";

export function ProfileSettings() {
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    bio: userProfile?.bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings_page.profile.title", "Perfil")}</CardTitle>
        <CardDescription>
          {t(
            "settings_page.profile.description",
            "Gerencie suas informações pessoais"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={userProfile?.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-lg">
              {userProfile?.name?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline" size="sm">
            <Camera className="h-4 w-4 mr-2" />
            {t("settings_page.profile.avatar.change", "Alterar foto")}
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t("settings_page.profile.form.name", "Nome completo")}
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder={t(
                  "settings_page.profile.form.name_placeholder",
                  "Seu nome completo"
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {t("settings_page.profile.form.email", "Email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder={t(
                  "settings_page.profile.form.email_placeholder",
                  "seu@email.com"
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">
              {t("settings_page.profile.form.bio", "Bio")}
            </Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder={t(
                "settings_page.profile.form.bio_placeholder",
                "Conte um pouco sobre você..."
              )}
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading
              ? t("settings_page.profile.form.saving", "Salvando...")
              : t("settings_page.profile.form.save", "Salvar alterações")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
