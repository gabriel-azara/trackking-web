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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Download, Upload } from "lucide-react";

export function PrivacySettings() {
  const [settings, setSettings] = useState({
    profileVisibility: "private",
    shareProgress: false,
    analyticsOptIn: true,
    dataCollection: true,
    thirdPartySharing: false,
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

  const handleExportData = () => {
    // Simular exportação de dados
    console.log("Exportando dados...");
  };

  const handleImportData = () => {
    // Simular importação de dados
    console.log("Importando dados...");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacidade e Dados</CardTitle>
        <CardDescription>
          Controle como seus dados são usados e compartilhados
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visibilidade do Perfil */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Visibilidade</h4>

          <div className="space-y-2">
            <Label htmlFor="profile-visibility">Visibilidade do perfil</Label>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value) =>
                handleSelectChange("profileVisibility", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Público</SelectItem>
                <SelectItem value="friends">Apenas amigos</SelectItem>
                <SelectItem value="private">Privado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="share-progress" className="text-sm">
              Compartilhar progresso publicamente
            </Label>
            <Switch
              id="share-progress"
              checked={settings.shareProgress}
              onCheckedChange={() => handleToggle("shareProgress")}
            />
          </div>
        </div>

        {/* Coleta de Dados */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Coleta de dados</h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics-opt-in" className="text-sm">
                Permitir análise de uso
              </Label>
              <Switch
                id="analytics-opt-in"
                checked={settings.analyticsOptIn}
                onCheckedChange={() => handleToggle("analyticsOptIn")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="data-collection" className="text-sm">
                Coleta de dados para melhorias
              </Label>
              <Switch
                id="data-collection"
                checked={settings.dataCollection}
                onCheckedChange={() => handleToggle("dataCollection")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="third-party-sharing" className="text-sm">
                Compartilhamento com terceiros
              </Label>
              <Switch
                id="third-party-sharing"
                checked={settings.thirdPartySharing}
                onCheckedChange={() => handleToggle("thirdPartySharing")}
              />
            </div>
          </div>
        </div>

        {/* Gerenciamento de Dados */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Seus dados</h4>

          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="flex-1 bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar dados
            </Button>
            <Button
              variant="outline"
              onClick={handleImportData}
              className="flex-1 bg-transparent"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar dados
            </Button>
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
