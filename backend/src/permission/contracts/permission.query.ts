import { QueryConfig, fields } from "src/common/query";

export const permissionQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  value: fields.stringField("value"),
  description: fields.stringField("description"),
  createdAt: fields.datetimeField("createdAt"),
  updatedAt: fields.datetimeField("updatedAt"),
});
