"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

import { useTranslation } from "@/app/i18n/client";

export function NotificationSettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    habitReminders: true,
    goalDeadlines: true,
    taskDueDates: true,
    weeklyReports: false,
    achievements: true,
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: "09:00",
    frequency: "daily",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simular salvamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("settings_page.notifications.title", "Notificações")}
        </CardTitle>
        <CardDescription>
          {t(
            "settings_page.notifications.description",
            "Configure como e quando você quer ser notificado"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipos de Notificação */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">
            {t(
              "settings_page.notifications.types.title",
              "Tipos de notificação"
            )}
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="habit-reminders" className="text-sm">
                {t(
                  "settings_page.notifications.types.habit_reminders",
                  "Lembretes de hábitos"
                )}
              </Label>
              <Switch
                id="habit-reminders"
                checked={settings.habitReminders}
                onCheckedChange={() => handleToggle("habitReminders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="goal-deadlines" className="text-sm">
                {t(
                  "settings_page.notifications.types.goal_deadlines",
                  "Prazos de metas"
                )}
              </Label>
              <Switch
                id="goal-deadlines"
                checked={settings.goalDeadlines}
                onCheckedChange={() => handleToggle("goalDeadlines")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="task-due-dates" className="text-sm">
                {t(
                  "settings_page.notifications.types.task_due_dates",
                  "Vencimento de tarefas"
                )}
              </Label>
              <Switch
                id="task-due-dates"
                checked={settings.taskDueDates}
                onCheckedChange={() => handleToggle("taskDueDates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-reports" className="text-sm">
                {t(
                  "settings_page.notifications.types.weekly_reports",
                  "Relatórios semanais"
                )}
              </Label>
              <Switch
                id="weekly-reports"
                checked={settings.weeklyReports}
                onCheckedChange={() => handleToggle("weeklyReports")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="achievements" className="text-sm">
                {t(
                  "settings_page.notifications.types.achievements",
                  "Conquistas e marcos"
                )}
              </Label>
              <Switch
                id="achievements"
                checked={settings.achievements}
                onCheckedChange={() => handleToggle("achievements")}
              />
            </div>
          </div>
        </div>

        {/* Canais de Notificação */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">
            {t(
              "settings_page.notifications.channels.title",
              "Canais de notificação"
            )}
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm">
                {t(
                  "settings_page.notifications.channels.email",
                  "Notificações por email"
                )}
              </Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="text-sm">
                {t(
                  "settings_page.notifications.channels.push",
                  "Notificações push"
                )}
              </Label>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={() => handleToggle("pushNotifications")}
              />
            </div>
          </div>
        </div>

        {/* Configurações de Horário */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">
            {t("settings_page.notifications.schedule.title", "Horários")}
          </h4>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reminder-time">
                {t(
                  "settings_page.notifications.schedule.reminder_time",
                  "Horário dos lembretes"
                )}
              </Label>
              <Select
                value={settings.reminderTime}
                onValueChange={(value) =>
                  handleSelectChange("reminderTime", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="07:00">07:00</SelectItem>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="19:00">19:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">
                {t(
                  "settings_page.notifications.schedule.frequency",
                  "Frequência dos relatórios"
                )}
              </Label>
              <Select
                value={settings.frequency}
                onValueChange={(value) =>
                  handleSelectChange("frequency", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">
                    {t("settings_page.notifications.schedule.daily", "Diário")}
                  </SelectItem>
                  <SelectItem value="weekly">
                    {t(
                      "settings_page.notifications.schedule.weekly",
                      "Semanal"
                    )}
                  </SelectItem>
                  <SelectItem value="monthly">
                    {t(
                      "settings_page.notifications.schedule.monthly",
                      "Mensal"
                    )}
                  </SelectItem>
                  <SelectItem value="never">
                    {t("settings_page.notifications.schedule.never", "Nunca")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading
            ? t("settings_page.notifications.saving", "Salvando...")
            : t("settings_page.notifications.save", "Salvar configurações")}
        </Button>
      </CardContent>
    </Card>
  );
}
