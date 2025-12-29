"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun, Save } from "lucide-react";
import { useTranslation } from "@/app/i18n/client";
import { LanguageSelector } from "@/components/language-selector";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    reducedMotion: false,
    highContrast: false,
    compactMode: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("settings_page.appearance.title", "Aparência")}
        </CardTitle>
        <CardDescription>
          {t(
            "settings_page.appearance.description",
            "Personalize a aparência da aplicação"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tema */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            {t("settings_page.appearance.theme.label", "Tema")}
          </Label>
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="light" id="light" />
              <Label
                htmlFor="light"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Sun className="h-4 w-4" />
                <span>
                  {t("settings_page.appearance.theme.light", "Claro")}
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="dark" id="dark" />
              <Label
                htmlFor="dark"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Moon className="h-4 w-4" />
                <span>
                  {t("settings_page.appearance.theme.dark", "Escuro")}
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="system" id="system" />
              <Label
                htmlFor="system"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Monitor className="h-4 w-4" />
                <span>
                  {t("settings_page.appearance.theme.system", "Sistema")}
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Idioma */}
        <div className="space-y-4">
          <Label className="text-sm font-medium">
            {t("settings_page.appearance.language", "Idioma")}
          </Label>
          <LanguageSelector />
        </div>

        {/* Acessibilidade */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">
            {t(
              "settings_page.appearance.accessibility.title",
              "Acessibilidade"
            )}
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="text-sm">
                {t(
                  "settings_page.appearance.accessibility.reduced_motion",
                  "Reduzir animações"
                )}
              </Label>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={() => handleToggle("reducedMotion")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="text-sm">
                {t(
                  "settings_page.appearance.accessibility.high_contrast",
                  "Alto contraste"
                )}
              </Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={() => handleToggle("highContrast")}
              />
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">
            {t("settings_page.appearance.layout.title", "Layout")}
          </h4>

          <div className="flex items-center justify-between">
            <Label htmlFor="compact-mode" className="text-sm">
              {t(
                "settings_page.appearance.layout.compact_mode",
                "Modo compacto"
              )}
            </Label>
            <Switch
              id="compact-mode"
              checked={settings.compactMode}
              onCheckedChange={() => handleToggle("compactMode")}
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading
            ? t("settings_page.appearance.saving", "Salvando...")
            : t("settings_page.appearance.save", "Salvar configurações")}
        </Button>
      </CardContent>
    </Card>
  );
}
