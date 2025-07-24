export type PaginationParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type FormState = {
  isLoading: boolean;
  error: string | null;
  success: boolean;
};

export type TableColumn<T = unknown> = {
  id: string;
  label: string;
  sortable?: boolean;
  accessor?: keyof T | ((item: T) => unknown);
  render?: (value: unknown, item: T) => React.ReactNode;
  width?: string;
};
