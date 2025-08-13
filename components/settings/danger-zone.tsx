"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";

export function DangerZone() {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETAR") return;

    setIsDeleting(true);
    // Simular deleção da conta
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDeleting(false);
  };

  const isDeleteEnabled = confirmText === "DELETAR";

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Zona de Perigo
        </CardTitle>
        <CardDescription>
          Ações irreversíveis que afetam permanentemente sua conta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <h4 className="text-sm font-medium text-destructive mb-2">
            Deletar conta
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Esta ação não pode ser desfeita. Todos os seus dados, incluindo
            hábitos, metas, tarefas e progresso serão permanentemente removidos.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Deletar conta
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    Esta ação não pode ser desfeita. Isso irá permanentemente
                    deletar sua conta e remover todos os seus dados de nossos
                    servidores.
                  </p>
                  <p>
                    Para confirmar, digite <strong>DELETAR</strong> no campo
                    abaixo:
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-2">
                <Label htmlFor="confirm-delete">
                  Digite "DELETAR" para confirmar
                </Label>
                <Input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETAR"
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setConfirmText("")}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={!isDeleteEnabled || isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deletando..." : "Deletar conta"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
