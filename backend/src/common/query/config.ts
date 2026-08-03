import { col, where, OrderItem, WhereOptions, Op, Includeable } from "sequelize";

import { SortOrder, FilterOperator, SearchMode } from "./models";

/* -------------------- Filter -------------------- */

export class QueryFilter {
  constructor(
    public default_operator: FilterOperator,
    public operators: Set<FilterOperator> = new Set([FilterOperator.EQ]),
  ) {
    if (!this.operators.has(default_operator)) {
      throw new Error("default_operator must be present in operators");
    }
  }

  supports(operator: FilterOperator): boolean {
    return this.operators.has(operator);
  }
}

/* -------------------- Search -------------------- */

export class QuerySearch {
  constructor(
    public default_mode: SearchMode,
    public modes: Set<SearchMode> = new Set([SearchMode.CONTAINS]),
  ) {
    if (!this.modes.has(default_mode)) {
      throw new Error("default_mode must be present in modes.");
    }
  }

  supports(mode: SearchMode): boolean {
    return this.modes.has(mode);
  }
}

/* -------------------- Sort -------------------- */

export class QuerySort {
  constructor(
    public default_order: SortOrder = SortOrder.ASC,
    public orders: Set<SortOrder> = new Set([SortOrder.ASC, SortOrder.DESC]),
  ) {
    if (!this.orders.has(default_order)) {
      throw new Error("default_order must be present in orders.");
    }
  }

  supports(order: SortOrder): boolean {
    return this.orders.has(order);
  }
}

/* -------------------- Field -------------------- */

export class QueryField {
  constructor(
    public column: ReturnType<typeof col>,
    public relationships: Includeable[] = [],
    public filter?: QueryFilter,
    public search?: QuerySearch,
    public sort?: QuerySort,
  ) {}

  get can_filter(): boolean {
    return this.filter !== undefined;
  }

  get can_search(): boolean {
    return this.search !== undefined;
  }

  get can_sort(): boolean {
    return this.sort !== undefined;
  }

  private buildComparisonExpression(value: unknown, operator?: symbol): WhereOptions {
    if (!operator) {
      return where(this.column, value);
    }

    return where(this.column, {
      [operator]: value,
    });
  }

  private buildLikeExpression(pattern: string): WhereOptions {
    return where(this.column, {
      [Op.iLike]: pattern,
    });
  }

  buildFilterExpression(value: unknown, operator?: FilterOperator): WhereOptions | undefined {
    if (!this.filter) {
      return undefined;
    }

    operator = operator ?? this.filter.default_operator;

    if (!this.filter.supports(operator)) {
      return undefined;
    }

    switch (operator) {
      case FilterOperator.EQ:
        return this.buildComparisonExpression(value);

      case FilterOperator.GT:
        return this.buildComparisonExpression(value, Op.gt);

      case FilterOperator.GTE:
        return this.buildComparisonExpression(value, Op.gte);

      case FilterOperator.LT:
        return this.buildComparisonExpression(value, Op.lt);

      case FilterOperator.LTE:
        return this.buildComparisonExpression(value, Op.lte);

      case FilterOperator.CONTAINS:
        return this.buildLikeExpression(`%${String(value)}%`);

      case FilterOperator.STARTSWITH:
        return this.buildLikeExpression(`${String(value)}%`);

      case FilterOperator.ENDSWITH:
        return this.buildLikeExpression(`%${String(value)}`);

      case FilterOperator.IN:
        if (!Array.isArray(value)) {
          return undefined;
        }

        return this.buildComparisonExpression(value, Op.in);
    }

    throw new Error(`Unsupported filter operator: ${operator}`);
  }

  buildSearchExpression(value: string, mode?: SearchMode): WhereOptions | undefined {
    if (!this.search) {
      return undefined;
    }

    mode = mode ?? this.search.default_mode;

    if (!this.search.supports(mode)) {
      return undefined;
    }

    switch (mode) {
      case SearchMode.EXACT:
        return this.buildComparisonExpression(value);

      case SearchMode.CONTAINS:
        return this.buildLikeExpression(`%${value}%`);

      case SearchMode.STARTSWITH:
        return this.buildLikeExpression(`${value}%`);

      case SearchMode.ENDSWITH:
        return this.buildLikeExpression(`%${value}`);
    }

    throw new Error(`Unsupported search mode: ${mode}`);
  }

  buildSortExpression(order?: SortOrder): OrderItem | undefined {
    if (!this.sort) {
      return undefined;
    }

    order = order ?? this.sort.default_order;

    if (!this.sort.supports(order)) {
      return undefined;
    }

    switch (order) {
      case SortOrder.ASC:
        return [this.column, "ASC"];

      case SortOrder.DESC:
        return [this.column, "DESC"];
    }

    throw new Error(`Unsupported sort order: ${order}`);
  }
}

/* -------------------- Config -------------------- */

export class QueryConfig {
  constructor(public fields: Record<string, QueryField>) {}
}
