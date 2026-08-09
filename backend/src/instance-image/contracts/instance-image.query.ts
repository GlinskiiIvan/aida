import { QueryConfig, fields } from "src/common/query";

import { Series } from "../../series/entities/series.entity";

const SeriesRel = {
  model: Series,
  as: "series",
};

export const imageQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  imageName: fields.stringField("imageName"),
  imagePath: fields.stringField("imagePath"),
  instanceNumber: fields.numberField("instanceNumber"),
  createdAt: fields.datetimeField("createdAt"),
  updatedAt: fields.datetimeField("updatedAt"),

  "series.id": fields.numberField("series.id", [SeriesRel]),
  "series.studyId": fields.numberField("series.studyId", [SeriesRel]),
  "series.seriesNumber": fields.stringField("series.seriesNumber", [SeriesRel]),
  "series.modality": fields.enumField("series.modality", [SeriesRel]),
  "series.protocol": fields.enumField("series.protocol", [SeriesRel]),
  "series.orientation": fields.enumField("series.orientation", [SeriesRel]),
  "series.imagesCount": fields.numberField("series.imagesCount", [SeriesRel]),
  "series.path": fields.stringField("series.path", [SeriesRel]),
  "series.status": fields.enumField("series.status", [SeriesRel]),
  "series.description": fields.stringField("series.description", [SeriesRel]),
  "series.createdAt": fields.datetimeField("series.createdAt", [SeriesRel]),
  "series.updatedAt": fields.datetimeField("series.updatedAt", [SeriesRel]),
});
