import { FindOptions, OrderItem } from "sequelize";

import { QueryParams } from "./schemas";
import { QueryConfig } from "./config";

export function applySorting(
  options: FindOptions,
  params: QueryParams,
  config: QueryConfig,
): FindOptions {
  const expressions: OrderItem[] = [];

  for (const sortParams of params.sorting) {
    if (!sortParams.by) {
      continue;
    }

    const field = config.fields[sortParams.by];

    if (!field || !field.can_sort) {
      continue;
    }

    const expression = field.buildSortExpression(sortParams.order);

    if (expression) {
      expressions.push(expression);
    }
  }

  if (expressions.length > 0) {
    return {
      ...options,
      order: expressions,
    };
  }

  return options;
}
