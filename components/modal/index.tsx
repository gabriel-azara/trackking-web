"use client";

import { useState } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface ConfirmationModalProps {
  title: string;
  description: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => Promise<void> | void;
  children?: React.ReactNode;
  variant?: "destructive" | "default";
  requireTextConfirmation?: boolean;
  isLoading?: boolean;
}

export function ConfirmationModal({
  title,
  description,
  confirmText = "DELETAR",
  confirmLabel = "Deletar",
  cancelLabel = "Cancelar",
  onConfirm,
  children,
  variant = "destructive",
  requireTextConfirmation = true,
  isLoading = false,
}: ConfirmationModalProps) {
  const [confirmTextInput, setConfirmTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (requireTextConfirmation && confirmTextInput !== confirmText) return;

    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
      setConfirmTextInput("");
    }
  };

  const handleCancel = () => {
    setConfirmTextInput("");
  };

  const isConfirmEnabled = requireTextConfirmation
    ? confirmTextInput === confirmText
    : true;

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {children || (
            <Button variant={variant} size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              {confirmLabel}
            </Button>
          )}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>{description}</p>
              {requireTextConfirmation && (
                <p>
                  Para confirmar, digite <strong>{confirmText}</strong> no campo
                  abaixo:
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {requireTextConfirmation && (
            <div className="space-y-2">
              <Label htmlFor="confirm-text">
                Se você clicar em &quot;{confirmText}&quot;, a ação será
                executada.onfirmar
              </Label>
              <Input
                id="confirm-text"
                value={confirmTextInput}
                onChange={(e) => setConfirmTextInput(e.target.value)}
                placeholder={confirmText}
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              disabled={!isConfirmEnabled || isProcessing || isLoading}
              className={
                variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {isProcessing || isLoading ? "Processando..." : confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
