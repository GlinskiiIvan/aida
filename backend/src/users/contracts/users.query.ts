import { QueryConfig } from "src/common/query";
import * as fields from "src/common/query/fields";

export const userQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  email: fields.stringField("email"),
  banReason: fields.stringField("banReason"),
  created_at: fields.datetimeField("created_at"),
  updated_at: fields.datetimeField("updated_at"),
});
