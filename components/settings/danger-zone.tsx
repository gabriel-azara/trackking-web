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

import { useTranslation } from "@/app/i18n/client";

export function DangerZone() {
  const { t } = useTranslation();
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
          {t("settings_page.account.title", "Zona de Perigo")}
        </CardTitle>
        <CardDescription>
          {t(
            "settings_page.account.description",
            "Ações irreversíveis que afetam permanentemente sua conta"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <h4 className="text-sm font-medium text-destructive mb-2">
            {t("settings_page.account.delete_account.title", "Deletar conta")}
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            {t(
              "settings_page.account.delete_account.description",
              "Esta ação não pode ser desfeita. Todos os seus dados, incluindo hábitos, metas, tarefas e progresso serão permanentemente removidos."
            )}
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                {t(
                  "settings_page.account.delete_account.button",
                  "Deletar conta"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {t(
                    "settings_page.account.delete_account.dialog.title",
                    "Tem certeza absoluta?"
                  )}
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    {t(
                      "settings_page.account.delete_account.dialog.description_1",
                      "Esta ação não pode ser desfeita. Isso irá permanentemente deletar sua conta e remover todos os seus dados de nossos servidores."
                    )}
                  </p>
                  <p>
                    {t(
                      "settings_page.account.delete_account.dialog.description_2",
                      "Para confirmar, digite DELETAR no campo abaixo:"
                    )}
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="space-y-2">
                <Label htmlFor="confirm-delete">
                  {t(
                    "settings_page.account.delete_account.dialog.input_label",
                    'Digite "DELETAR" para confirmar.'
                  )}
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
                  {t(
                    "settings_page.account.delete_account.dialog.cancel",
                    "Cancelar"
                  )}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={!isDeleteEnabled || isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting
                    ? t(
                        "settings_page.account.delete_account.dialog.deleting",
                        "Deletando..."
                      )
                    : t(
                        "settings_page.account.delete_account.dialog.confirm",
                        "Deletar conta"
                      )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
