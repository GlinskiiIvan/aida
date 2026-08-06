import { QueryConfig, fields } from "src/common/query";

export const permissionQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  value: fields.stringField("value"),
  description: fields.stringField("description"),
  created_at: fields.datetimeField("created_at"),
  updated_at: fields.datetimeField("updated_at"),
});
