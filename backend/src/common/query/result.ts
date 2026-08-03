import { QueryResult, QueryParams } from "./schemas";

export function buildResult<T>(rows: T[], total: number, params?: QueryParams): QueryResult<T> {
  let page = 1;
  let page_size = total || rows.length;

  if (params) {
    page = params.pagination.page ?? page;
    page_size = params.pagination.page_size ?? page_size;
  }

  return {
    data: rows,
    total_items: total,
    total_pages: page_size ? Math.ceil(total / page_size) : 1,
    current_page: page,
  };
}
