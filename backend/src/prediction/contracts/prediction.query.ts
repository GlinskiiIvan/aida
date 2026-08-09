import { QueryConfig, fields } from "src/common/query";

import { PredictionRun } from "../../prediction-run/entities/prediction-run.entity";
import { InstanceImage } from "../../instance-image/entities/instance-image.entity";

const PredictionRunRel = {
  model: PredictionRun,
  as: "run",
};

const InstanceImageRel = {
  model: InstanceImage,
  as: "image",
};

export const predictionQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  status: fields.enumField("status"),
  resultClass: fields.enumField("resultClass"),
  maxConfidence: fields.numberField("maxConfidence"),
  minConfidence: fields.numberField("minConfidence"),
  executionTime: fields.numberField("executionTime"),
  createdAt: fields.datetimeField("createdAt"),
  updatedAt: fields.datetimeField("updatedAt"),

  "run.id": fields.numberField("run.id", [PredictionRunRel]),
  "run.studyId": fields.numberField("run.studyId", [PredictionRunRel]),
  "run.createdById": fields.numberField("run.createdById", [PredictionRunRel]),
  "run.model": fields.stringField("run.model", [PredictionRunRel]),
  "run.version": fields.stringField("run.version", [PredictionRunRel]),
  "run.status": fields.enumField("run.status", [PredictionRunRel]),
  "run.createdAt": fields.datetimeField("run.createdAt", [PredictionRunRel]),
  "run.updatedAt": fields.datetimeField("run.updatedAt", [PredictionRunRel]),

  "image.id": fields.numberField("image.id", [InstanceImageRel]),
  "image.seriesId": fields.numberField("image.seriesId", [InstanceImageRel]),
  "image.imageName": fields.stringField("image.imageName", [InstanceImageRel]),
  "image.imagePath": fields.stringField("image.imagePath", [InstanceImageRel]),
  "image.instanceNumber": fields.numberField("image.instanceNumber", [InstanceImageRel]),
  "image.createdAt": fields.datetimeField("image.createdAt", [InstanceImageRel]),
  "image.updatedAt": fields.datetimeField("image.updatedAt", [InstanceImageRel]),
});
