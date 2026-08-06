import { QueryConfig } from "src/common/query";
import * as fields from "src/common/query/fields";

import { Patient } from "../../patient/entities/patient.entity";

const PatientRel = {
  model: Patient,
  as: "patient",
};

export const studyQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  studyInstanceUID: fields.stringField("studyInstanceUID"),
  studyId: fields.stringField("studyId"),
  specificCharacterSet: fields.stringField("specificCharacterSet"),
  studyDateTime: fields.datetimeField("studyDateTime"),
  modality: fields.enumField("modality"),
  description: fields.stringField("description"),
  institutionName: fields.stringField("institutionName"),
  manufacturer: fields.stringField("manufacturer"),
  manufacturersModelName: fields.stringField("manufacturersModelName"),
  stationName: fields.stringField("stationName"),
  referringPhysiciansName: fields.stringField("referringPhysiciansName"),
  status: fields.enumField("status"),
  path: fields.stringField("path"),
  seriesCount: fields.numberField("seriesCount"),
  imagesCount: fields.numberField("imagesCount"),
  note: fields.stringField("note"),
  created_at: fields.datetimeField("created_at"),
  updated_at: fields.datetimeField("updated_at"),

  "patient.id": fields.numberField("patient.id", [PatientRel]),
  "patient.doctorId": fields.numberField("patient.doctorId", [PatientRel]),
  "patient.fullName": fields.stringField("patient.fullName", [PatientRel]),
  "patient.birthDate": fields.datetimeField("patient.birthDate", [PatientRel]),
  "patient.gender": fields.enumField("patient.gender", [PatientRel]),
  "patient.phone": fields.stringField("patient.phone", [PatientRel]),
  "patient.email": fields.stringField("patient.email", [PatientRel]),
  "patient.note": fields.stringField("patient.note", [PatientRel]),
  "patient.created_at": fields.datetimeField("patient.created_at", [PatientRel]),
  "patient.updated_at": fields.datetimeField("patient.updated_at", [PatientRel]),
});
