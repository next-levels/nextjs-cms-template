"use client";

import { useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type FormActionsProps = {
  isSubmitting: boolean;
  showCancelButton?: boolean;
  submitText?: string;
  cancelText?: string;
  className?: string;
  onCancel?: () => void;
};

export default function FormActions({
  isSubmitting,
  showCancelButton = false,
  submitText = "Speichern",
  cancelText = "Abbrechen",
  className,
  onCancel,
}: FormActionsProps) {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <div className={cn("flex justify-end gap-4", className)}>
      {showCancelButton && (
        <Button type="button" variant="outline" onClick={handleCancel}>
          {cancelText}
        </Button>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? `${submitText}...` : submitText}
      </Button>
    </div>
  );
}
