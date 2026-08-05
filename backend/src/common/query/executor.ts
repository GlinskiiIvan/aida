import { FindOptions, Model, ModelStatic } from "sequelize";

import { QueryParams } from "./schemas";
import { QueryConfig } from "./config";
import { applyQuery } from "./query";
import { getResolvedPagination } from "./pagination";

export async function executeQueryResponse<T extends Model>(
  repository: ModelStatic<T>,
  config: QueryConfig,
  params: QueryParams,
  options: FindOptions,
) {
  const { query, countOptions } = applyQuery(config, params, options);
  const total = await repository.count(countOptions);
  const { page, page_size } = getResolvedPagination(total, params);
  const rows = await repository.findAll(query);

  return {
    data: rows,
    resolvedPageination: { total, page_size, page },
  };
}
