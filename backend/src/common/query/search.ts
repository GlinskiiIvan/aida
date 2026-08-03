import { FindOptions, Op, WhereOptions } from "sequelize";

import { QueryConfig } from "./config";
import { QueryParams } from "./schemas";

export function applySearch(
  options: FindOptions,
  params: QueryParams,
  config: QueryConfig,
): FindOptions {
  const search = params.search;

  if (!search.enabled || !search.value) {
    return options;
  }

  const expressions: WhereOptions[] = [];

  if (search.by) {
    const field = config.fields[search.by];

    if (!field || !field.can_search) {
      return options;
    }

    const expression = field.buildSearchExpression(search.value, search.mode);

    if (expression) {
      expressions.push(expression);
    }
  } else if (search.fields) {
    for (const name of search.fields) {
      const field = config.fields[name];

      if (!field || !field.can_search) {
        continue;
      }

      const expression = field.buildSearchExpression(search.value, search.mode);

      if (expression) {
        expressions.push(expression);
      }
    }
  } else {
    for (const field of Object.values(config.fields)) {
      if (!field.can_search) {
        continue;
      }

      const expression = field.buildSearchExpression(search.value, search.mode);

      if (expression) {
        expressions.push(expression);
      }
    }
  }

  if (expressions.length === 0) {
    return options;
  }

  const searchExpression: WhereOptions = {
    [Op.or]: expressions,
  };

  if (!options.where) {
    return {
      ...options,
      where: searchExpression,
    };
  }

  return {
    ...options,
    where: {
      [Op.and]: [options.where, searchExpression],
    },
  };
}
