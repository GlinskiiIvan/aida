import { FindOptions } from "sequelize";

import { collectRelationships, applyRelationships } from "./relationships";
import { applyFilters } from "./filters";
import { applySearch } from "./search";
import { applySorting } from "./sorting";
import { applyPagination } from "./pagination";

import { QueryParams } from "./schemas";
import { QueryConfig } from "./config";

export function applyQuery(
  options: FindOptions,
  config: QueryConfig,
  params?: QueryParams,
): FindOptions {
  if (!params) {
    return options;
  }

  const relationships = collectRelationships(params, config);

  let query = applyRelationships(options, relationships);

  query = applyFilters(query, params, config);
  query = applySearch(query, params, config);
  query = applySorting(query, params, config);
  // query = applyPagination(query, params);

  return query;
}
