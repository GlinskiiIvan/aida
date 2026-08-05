import { QueryConfig } from "src/common/query";
import * as fields from "src/common/query/fields";

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
  created_at: fields.datetimeField("created_at"),
  updated_at: fields.datetimeField("updated_at"),

  "series.id": fields.numberField("series.id", [SeriesRel]),
  "series.seriesNumber": fields.stringField("series.seriesNumber", [SeriesRel]),
  "series.modality": fields.enumField("series.modality", [SeriesRel]),
  "series.protocol": fields.enumField("series.protocol", [SeriesRel]),
  "series.orientation": fields.enumField("series.orientation", [SeriesRel]),
  "series.imagesCount": fields.numberField("series.imagesCount", [SeriesRel]),
  "series.path": fields.stringField("series.path", [SeriesRel]),
  "series.status": fields.enumField("series.status", [SeriesRel]),
  "series.description": fields.stringField("series.description", [SeriesRel]),
});
