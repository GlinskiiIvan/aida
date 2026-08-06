import { QueryConfig, fields } from "src/common/query";

import { Study } from "../../study/entities/study.entity";

const StudyRel = {
  model: Study,
  as: "study",
};

export const seriesQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  seriesNumber: fields.stringField("seriesNumber"),
  modality: fields.enumField("modality"),
  protocol: fields.enumField("protocol"),
  orientation: fields.enumField("orientation"),
  imagesCount: fields.numberField("imagesCount"),
  path: fields.stringField("path"),
  status: fields.enumField("status"),
  description: fields.stringField("description"),
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
});
