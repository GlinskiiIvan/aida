import { QueryFilter, QuerySearch, QuerySort } from "./config";

import { FilterOperator, SearchMode, SortOrder } from "./models";

export const STRING_SEARCH = new QuerySearch(
  SearchMode.CONTAINS,
  new Set([SearchMode.EXACT, SearchMode.CONTAINS, SearchMode.STARTSWITH, SearchMode.ENDSWITH]),
);

export const STRING_FILTER = new QueryFilter(
  FilterOperator.CONTAINS,
  new Set([
    FilterOperator.EQ,
    FilterOperator.CONTAINS,
    FilterOperator.STARTSWITH,
    FilterOperator.ENDSWITH,
  ]),
);

export const NUMBER_FILTER = new QueryFilter(
  FilterOperator.EQ,
  new Set([
    FilterOperator.EQ,
    FilterOperator.IN,
    FilterOperator.GT,
    FilterOperator.GTE,
    FilterOperator.LT,
    FilterOperator.LTE,
  ]),
);

export const DATE_FILTER = new QueryFilter(
  FilterOperator.GTE,
  new Set([
    FilterOperator.EQ,
    FilterOperator.IN,
    FilterOperator.GT,
    FilterOperator.GTE,
    FilterOperator.LT,
    FilterOperator.LTE,
  ]),
);

export const ENUM_FILTER = new QueryFilter(
  FilterOperator.EQ,
  new Set([FilterOperator.EQ, FilterOperator.IN]),
);

export const DEFAULT_SORT = new QuerySort();
export const DATE_SORT = new QuerySort(SortOrder.DESC);
