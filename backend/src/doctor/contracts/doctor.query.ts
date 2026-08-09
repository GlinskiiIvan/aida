import { QueryConfig, fields } from "src/common/query";

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
  createdAt: fields.datetimeField("createdAt"),
  updatedAt: fields.datetimeField("updatedAt"),

  "user.id": fields.numberField("user.id", [UserRel]),
  "user.email": fields.stringField("user.email", [UserRel]),
  "user.banReason": fields.stringField("user.banReason", [UserRel]),
  "user.createdAt": fields.datetimeField("user.createdAt", [UserRel]),
  "user.updatedAt": fields.datetimeField("user.updatedAt", [UserRel]),
});
