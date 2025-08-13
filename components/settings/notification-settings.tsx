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

export function NotificationSettings() {
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
        <CardTitle>Notificações</CardTitle>
        <CardDescription>
          Configure como e quando você quer ser notificado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipos de Notificação */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Tipos de notificação</h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="habit-reminders" className="text-sm">
                Lembretes de hábitos
              </Label>
              <Switch
                id="habit-reminders"
                checked={settings.habitReminders}
                onCheckedChange={() => handleToggle("habitReminders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="goal-deadlines" className="text-sm">
                Prazos de metas
              </Label>
              <Switch
                id="goal-deadlines"
                checked={settings.goalDeadlines}
                onCheckedChange={() => handleToggle("goalDeadlines")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="task-due-dates" className="text-sm">
                Vencimento de tarefas
              </Label>
              <Switch
                id="task-due-dates"
                checked={settings.taskDueDates}
                onCheckedChange={() => handleToggle("taskDueDates")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-reports" className="text-sm">
                Relatórios semanais
              </Label>
              <Switch
                id="weekly-reports"
                checked={settings.weeklyReports}
                onCheckedChange={() => handleToggle("weeklyReports")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="achievements" className="text-sm">
                Conquistas e marcos
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
          <h4 className="text-sm font-medium">Canais de notificação</h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-sm">
                Notificações por email
              </Label>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="text-sm">
                Notificações push
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
          <h4 className="text-sm font-medium">Horários</h4>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Horário dos lembretes</Label>
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
              <Label htmlFor="frequency">Frequência dos relatórios</Label>
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
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="never">Nunca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Salvando..." : "Salvar configurações"}
        </Button>
      </CardContent>
    </Card>
  );
}
