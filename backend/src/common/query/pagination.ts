import { FindOptions } from "sequelize";

import { QueryParams } from "./schemas";

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
