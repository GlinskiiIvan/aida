import { FindOptions, Includeable } from "sequelize";

import { QueryConfig } from "./config";
import { QueryParams, FilterGroup } from "./schemas";

export function collectRelationships(params: QueryParams, config: QueryConfig): Includeable[] {
  const collected: Includeable[] = [];

  //
  // SEARCH
  //

  if (params.search.by) {
    const field = config.fields[params.search.by];

    if (field) {
      collected.push(...field.relationships);
    }
  } else if (params.search.fields) {
    for (const name of params.search.fields) {
      const field = config.fields[name];

      if (field) {
        collected.push(...field.relationships);
      }
    }
  } else {
    for (const field of Object.values(config.fields)) {
      if (field.can_search) {
        collected.push(...field.relationships);
      }
    }
  }

  //
  // FILTERS
  //

  function collectGroup(group: FilterGroup) {
    for (const filterParams of group.filters) {
      if (!filterParams.by) {
        continue;
      }

      const field = config.fields[filterParams.by];

      if (field) {
        collected.push(...field.relationships);
      }
    }

    for (const subgroup of group.groups) {
      collectGroup(subgroup);
    }
  }

  collectGroup(params.filters);

  //
  // SORTING
  //

  for (const sort of params.sorting) {
    if (!sort.by) {
      continue;
    }

    const field = config.fields[sort.by];

    if (field) {
      collected.push(...field.relationships);
    }
  }

  //
  // REMOVE DUPLICATES
  //

  const result: Includeable[] = [];
  const seen = new Set<Includeable>();

  for (const relationship of collected) {
    if (seen.has(relationship)) {
      continue;
    }

    seen.add(relationship);
    result.push(relationship);
  }

  return result;
}

export function applyRelationships(
  options: FindOptions,
  relationships: Includeable[],
): FindOptions {
  if (relationships.length === 0) {
    return options;
  }

  const existingIncludes = options.include
    ? Array.isArray(options.include)
      ? options.include
      : [options.include]
    : [];

  return {
    ...options,
    include: [...existingIncludes, ...relationships],
  };
}
