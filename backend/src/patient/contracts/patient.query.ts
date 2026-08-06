import { QueryConfig } from "src/common/query";
import * as fields from "src/common/query/fields";

import { Doctor } from "../../doctor/entities/doctor.entity";

const DoctorRel = {
  model: Doctor,
  as: "doctor",
};

export const patientQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  fullName: fields.stringField("fullName"),
  birthDate: fields.datetimeField("birthDate"),
  gender: fields.enumField("gender"),
  phone: fields.stringField("phone"),
  email: fields.stringField("email"),
  note: fields.stringField("note"),
  created_at: fields.datetimeField("created_at"),
  updated_at: fields.datetimeField("updated_at"),

  "doctor.id": fields.numberField("doctor.id", [DoctorRel]),
  "doctor.userId": fields.numberField("doctor.userId", [DoctorRel]),
  "doctor.fullName": fields.stringField("doctor.fullName", [DoctorRel]),
  "doctor.birthDate": fields.datetimeField("doctor.birthDate", [DoctorRel]),
  "doctor.gender": fields.enumField("doctor.gender", [DoctorRel]),
  "doctor.phone": fields.stringField("doctor.phone", [DoctorRel]),
  "doctor.contactEmail": fields.stringField("doctor.contactEmail", [DoctorRel]),
  "doctor.specialization": fields.stringField("doctor.specialization", [DoctorRel]),
  "doctor.department": fields.stringField("doctor.department", [DoctorRel]),
  "doctor.licenseNumber": fields.stringField("doctor.licenseNumber", [DoctorRel]),
  "doctor.note": fields.stringField("doctor.note", [DoctorRel]),
  "doctor.created_at": fields.datetimeField("doctor.created_at", [DoctorRel]),
  "doctor.updated_at": fields.datetimeField("doctor.updated_at", [DoctorRel]),
});
