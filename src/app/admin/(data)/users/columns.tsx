"use client";

import { type User } from "@mikestraczek/cms-auth";
import {
  Button,
  DataTableColumnHeader,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@mikestraczek/cms-ui";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

function ActionCell({
  user,
  isLoading,
  onSuccess,
}: {
  user: User;
  isLoading?: boolean;
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteEntity = api.user.delete.useMutation({
    onSuccess: () => {
      router.refresh();
      onSuccess?.();
      toast.success("Benutzer erfolgreich gelöscht");
    },
  });

  const handleDelete = async () => {
    if (!window.confirm(`Benutzer "${user.email}" wirklich löschen?`)) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteEntity.mutateAsync({ id: user.id });
    } catch {
      toast.error("Fehler beim Löschen des Benutzers");
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ml-auto block">
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
          <span className="sr-only">Öffnen Menü</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Aktionen</DropdownMenuLabel>

        <DropdownMenuItem asChild disabled={isLoading}>
          <Link href={`/admin/users/${user.id}`}>Ansehen</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          disabled={isDeleting || isLoading}
          onClick={handleDelete}
          className="text-red-600 focus:text-red-600"
        >
          {isDeleting ? "Löschen..." : "Löschen"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type DataTableProps = {
  isLoading?: boolean;
  onSuccess?: () => void;
};

export const getColumns = ({
  isLoading,
  onSuccess,
}: DataTableProps = {}): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
        isLoading={isLoading}
      />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="E-Mail"
        isLoading={isLoading}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ActionCell
        user={row.original}
        isLoading={isLoading}
        onSuccess={onSuccess}
      />
    ),
  },
];
