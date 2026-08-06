import { QueryConfig, fields } from "src/common/query";

import { Study } from "../../study/entities/study.entity";
import { User } from "../../users/entities/user.entity";

const StudyRel = {
  model: Study,
  as: "study",
};

const UserRel = {
  model: User,
  as: "createdBy",
};

export const predictionRunQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  model: fields.stringField("model"),
  version: fields.stringField("version"),
  status: fields.enumField("status"),
  created_at: fields.datetimeField("created_at"),
  updated_at: fields.datetimeField("updated_at"),

  "study.id": fields.numberField("study.id", [StudyRel]),
  "study.patientId": fields.numberField("study.patientId", [StudyRel]),
  "study.studyInstanceUID": fields.stringField("study.studyInstanceUID", [StudyRel]),
  "study.studyId": fields.stringField("study.studyId", [StudyRel]),
  "study.specificCharacterSet": fields.stringField("study.specificCharacterSet", [StudyRel]),
  "study.studyDateTime": fields.datetimeField("study.studyDateTime", [StudyRel]),
  "study.modality": fields.enumField("study.modality", [StudyRel]),
  "study.description": fields.stringField("study.description", [StudyRel]),
  "study.institutionName": fields.stringField("study.institutionName", [StudyRel]),
  "study.manufacturer": fields.stringField("study.manufacturer", [StudyRel]),
  "study.manufacturersModelName": fields.stringField("study.manufacturersModelName", [StudyRel]),
  "study.stationName": fields.stringField("study.stationName", [StudyRel]),
  "study.referringPhysiciansName": fields.stringField("study.referringPhysiciansName", [StudyRel]),
  "study.status": fields.enumField("study.status", [StudyRel]),
  "study.path": fields.stringField("study.path", [StudyRel]),
  "study.seriesCount": fields.numberField("study.seriesCount", [StudyRel]),
  "study.imagesCount": fields.numberField("study.imagesCount", [StudyRel]),
  "study.note": fields.stringField("study.note", [StudyRel]),
  "study.created_at": fields.datetimeField("study.created_at", [StudyRel]),
  "study.updated_at": fields.datetimeField("study.updated_at", [StudyRel]),

  "createdBy.id": fields.numberField("createdBy.id", [UserRel]),
  "createdBy.email": fields.stringField("createdBy.email", [UserRel]),
  "createdBy.banReason": fields.stringField("createdBy.banReason", [UserRel]),
  "createdBy.created_at": fields.datetimeField("createdBy.created_at", [UserRel]),
  "createdBy.updated_at": fields.datetimeField("createdBy.updated_at", [UserRel]),
});
