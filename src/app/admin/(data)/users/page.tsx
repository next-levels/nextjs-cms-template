"use client";

import type { PaginationState, SortingState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button, DataTable } from "@mikestraczek/cms-ui";
import { api } from "~/trpc/react";
import { getColumns } from "./columns";

export default function ListPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const strapiPage = pagination.pageIndex + 1;
  const strapiPageSize = pagination.pageSize;
  const strapiSortBy = sorting.length > 0 ? sorting[0]?.id : undefined;
  const strapiSortOrder =
    sorting.length > 0 ? (sorting[0]?.desc ? "desc" : "asc") : undefined;

  const utils = api.useUtils();

  const { data, isLoading } = api.user.fetchPaginated.useQuery({
    page: strapiPage,
    pageSize: strapiPageSize,
    sortBy: strapiSortBy,
    sortOrder: strapiSortOrder,
  });

  const columns = getColumns({
    isLoading,
    onSuccess: () => {
      void utils.user.fetchPaginated.invalidate();
    },
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Benutzer</h1>
          <p className="text-muted-foreground">
            Hier kannst du alle Benutzer verwalten.
          </p>
        </div>

        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="size-4" />
            Neuer Benutzer
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        pageCount={data?.meta.pagination.pageCount ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortingChange={setSorting}
        isLoading={isLoading}
      />
    </div>
  );
}
