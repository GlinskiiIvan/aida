import { FindOptions, CountOptions } from "sequelize";

import { collectRelationships, applyRelationships } from "./relationships";
import { applyFilters } from "./filters";
import { applySearch } from "./search";
import { applySorting } from "./sorting";
import { applyPagination } from "./pagination";

import { QueryParams } from "./schemas";
import { QueryConfig } from "./config";

export type QueryOptions = {
  query: FindOptions;
  countOptions: CountOptions;
};

export function applyQuery(
  config: QueryConfig,
  params?: QueryParams,
  options: FindOptions = {},
): QueryOptions {
  if (!params) {
    return {
      query: options,
      countOptions: {
        where: options.where,
        include: options.include,
        distinct: true,
      },
    };
  }

  const relationships = collectRelationships(params, config);

  let query = applyRelationships(options, relationships);

  query = applyFilters(query, params, config);
  query = applySearch(query, params, config);
  query = applySorting(query, params, config);

  const countOptions: CountOptions = {
    where: query.where,
    include: query.include,
    distinct: true,
  };

  query = applyPagination(query, params);

  return {
    query,
    countOptions,
  };
}
