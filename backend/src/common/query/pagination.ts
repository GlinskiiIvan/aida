import { FindOptions } from "sequelize";

import { QueryParams, ResolvedPagination } from "./schemas";

export function applyPagination(options: FindOptions, params?: QueryParams): FindOptions {
  if (!params) {
    return options;
  }

  if (!params.pagination.enabled) {
    return options;
  }

  return {
    ...options,
    offset: params.pagination.offset,
    limit: params.pagination.page_size,
  };
}

export function getResolvedPagination(total: number, params?: QueryParams): ResolvedPagination {
  return {
    page: params?.pagination.page ?? 1,
    page_size: params?.pagination.page_size ?? (total || 1),
  };
}
