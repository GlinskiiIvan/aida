import { QueryConfig } from "src/common/query";
import * as fields from "src/common/query/fields";

import { User } from "../../users/entities/user.entity";

const UserRel = {
  model: User,
  as: "user",
};

export const doctorQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  fullName: fields.stringField("fullName"),
  birthDate: fields.datetimeField("birthDate"),
  gender: fields.enumField("gender"),
  phone: fields.stringField("phone"),
  contactEmail: fields.stringField("contactEmail"),
  specialization: fields.stringField("specialization"),
  department: fields.stringField("department"),
  licenseNumber: fields.stringField("licenseNumber"),
  note: fields.stringField("note"),
  created_at: fields.datetimeField("created_at"),
  updated_at: fields.datetimeField("updated_at"),

  "user.id": fields.numberField("user.id", [UserRel]),
  "user.email": fields.stringField("user.email", [UserRel]),
  "user.banReason": fields.stringField("user.banReason", [UserRel]),
  "user.created_at": fields.datetimeField("user.created_at", [UserRel]),
  "user.updated_at": fields.datetimeField("user.updated_at", [UserRel]),
});
