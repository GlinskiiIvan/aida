import { QueryConfig } from "src/common/query";
import * as fields from "src/common/query/fields";

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
  created_at: fields.datetimeField("created_at"),
  updated_at: fields.datetimeField("updated_at"),

  "run.id": fields.numberField("run.id", [PredictionRunRel]),
  "run.studyId": fields.numberField("run.studyId", [PredictionRunRel]),
  "run.createdById": fields.numberField("run.createdById", [PredictionRunRel]),
  "run.model": fields.stringField("run.model", [PredictionRunRel]),
  "run.version": fields.stringField("run.version", [PredictionRunRel]),
  "run.status": fields.enumField("run.status", [PredictionRunRel]),
  "run.created_at": fields.datetimeField("run.created_at", [PredictionRunRel]),
  "run.updated_at": fields.datetimeField("run.updated_at", [PredictionRunRel]),

  "image.id": fields.numberField("image.id", [InstanceImageRel]),
  "image.seriesId": fields.numberField("image.seriesId", [InstanceImageRel]),
  "image.imageName": fields.stringField("image.imageName", [InstanceImageRel]),
  "image.imagePath": fields.stringField("image.imagePath", [InstanceImageRel]),
  "image.instanceNumber": fields.numberField("image.instanceNumber", [InstanceImageRel]),
  "image.created_at": fields.datetimeField("image.created_at", [InstanceImageRel]),
  "image.updated_at": fields.datetimeField("image.updated_at", [InstanceImageRel]),
});
