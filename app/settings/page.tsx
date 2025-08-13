"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ProfileSettings } from "@/components/settings/profile-settings";
import { NotificationSettings } from "@/components/settings/notification-settings";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { PrivacySettings } from "@/components/settings/privacy-settings";
import { DangerZone } from "@/components/settings/danger-zone";
import { AppLayout } from "@/components/layout/app-layout";

export default function SettingsPage() {
  return (
    <AppLayout>
      <ProtectedRoute>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas preferências e configurações da conta
            </p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
              <TabsTrigger value="privacy">Privacidade</TabsTrigger>
              <TabsTrigger value="account">Conta</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="appearance">
              <ThemeSettings />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacySettings />
            </TabsContent>

            <TabsContent value="account">
              <DangerZone />
            </TabsContent>
          </Tabs>
        </div>
      </ProtectedRoute>
    </AppLayout>
  );
}
