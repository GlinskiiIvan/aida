export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export enum FilterOperator {
  EQ = "eq",
  GT = "gt",
  GTE = "gte",
  LT = "lt",
  LTE = "lte",
  CONTAINS = "contains",
  STARTSWITH = "startswith",
  ENDSWITH = "endswith",
  IN = "in",
}

export type FilterValue = string | number | boolean | Date | string[] | number[];

export enum SearchMode {
  EXACT = "exact",
  CONTAINS = "contains",
  STARTSWITH = "startswith",
  ENDSWITH = "endswith",
}

export enum GroupOperator {
  AND = "and",
  OR = "or",
}
