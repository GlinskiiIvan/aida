import { Includeable, col } from "sequelize";

import { QueryField } from "./config";
import * as presets from "./presets";
import * as features from "./features";

export function numberField(
  column: string | ReturnType<typeof col>,
  relationships: Includeable[] = [],
  fieldFeatures: features.FieldFeatures = features.ALL,
): QueryField {
  return new QueryField(
    typeof column === "string" ? col(column) : column,
    relationships,
    fieldFeatures.filter ? presets.NUMBER_FILTER : undefined,
    undefined,
    fieldFeatures.sort ? presets.DEFAULT_SORT : undefined,
  );
}

export function stringField(
  column: string | ReturnType<typeof col>,
  relationships: Includeable[] = [],
  fieldFeatures: features.FieldFeatures = features.ALL,
): QueryField {
  return new QueryField(
    typeof column === "string" ? col(column) : column,
    relationships,
    fieldFeatures.filter ? presets.STRING_FILTER : undefined,
    fieldFeatures.search ? presets.STRING_SEARCH : undefined,
    fieldFeatures.sort ? presets.DEFAULT_SORT : undefined,
  );
}

export function datetimeField(
  column: string | ReturnType<typeof col>,
  relationships: Includeable[] = [],
  fieldFeatures: features.FieldFeatures = features.ALL,
): QueryField {
  return new QueryField(
    typeof column === "string" ? col(column) : column,
    relationships,
    fieldFeatures.filter ? presets.DATE_FILTER : undefined,
    undefined,
    fieldFeatures.sort ? presets.DATE_SORT : undefined,
  );
}

export function enumField(
  column: string | ReturnType<typeof col>,
  relationships: Includeable[] = [],
  fieldFeatures: features.FieldFeatures = features.ALL,
): QueryField {
  return new QueryField(
    typeof column === "string" ? col(column) : column,
    relationships,
    fieldFeatures.filter ? presets.ENUM_FILTER : undefined,
    undefined,
    fieldFeatures.sort ? presets.DEFAULT_SORT : undefined,
  );
}
