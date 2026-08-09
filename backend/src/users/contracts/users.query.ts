import { QueryConfig, fields } from "src/common/query";

export const userQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  email: fields.stringField("email"),
  banReason: fields.stringField("banReason"),
  createdAt: fields.datetimeField("createdAt"),
  updatedAt: fields.datetimeField("updatedAt"),
});
