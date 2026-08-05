import { QueryConfig } from "src/common/query";
import * as fields from "src/common/query/fields";

export const roleQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  value: fields.stringField("value"),
  description: fields.stringField("description"),
  created_at: fields.datetimeField("created_at"),
  updated_at: fields.datetimeField("updated_at"),
});
