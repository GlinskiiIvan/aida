import { FindOptions, Op, WhereOptions } from "sequelize";

import { QueryParams, FilterGroup } from "./schemas";
import { QueryConfig } from "./config";
import { GroupOperator } from "./models";

export function buildFilterGroup(
  group: FilterGroup,
  config: QueryConfig,
): WhereOptions | undefined {
  const expressions: WhereOptions[] = [];

  for (const filterParams of group.filters) {
    if (!filterParams.by || filterParams.value === undefined) {
      continue;
    }

    const field = config.fields[filterParams.by];

    if (!field || !field.can_filter) {
      continue;
    }

    const expression = field.buildFilterExpression(filterParams.value, filterParams.operator);

    if (expression) {
      expressions.push(expression);
    }
  }

  for (const subgroup of group.groups) {
    const expression = buildFilterGroup(subgroup, config);

    if (expression) {
      expressions.push(expression);
    }
  }

  if (expressions.length === 0) {
    return undefined;
  }

  if (group.operator === GroupOperator.AND) {
    return { [Op.and]: expressions };
  }

  return { [Op.or]: expressions };
}

export function applyFilters(
  options: FindOptions,
  params: QueryParams,
  config: QueryConfig,
): FindOptions {
  const expression = buildFilterGroup(params.filters, config);

  if (!expression) {
    return options;
  }

  if (!options.where) {
    return {
      ...options,
      where: expression,
    };
  }

  return {
    ...options,
    where: {
      [Op.and]: [options.where, expression],
    },
  };
}
