import { QueryConfig } from "src/common/query/config";
import * as fields from "src/common/query/fields";

import { Series } from "../../series/entities/series.entity";

const SeriesRel = {
  model: Series,
  as: "series",
};

export const imageQueryConfig = new QueryConfig({
  id: fields.numberField("id"),
  seriesId: fields.stringField("seriesId"),
  imageName: fields.stringField("imageName"),
  imagePath: fields.stringField("imagePath"),
  instanceNumber: fields.numberField("instanceNumber"),
  created_at: fields.datetimeField("created_at"),

  "series.seriesNumber": fields.stringField("series.seriesNumber", [SeriesRel]),
  "series.protocol": fields.stringField("series.protocol", [SeriesRel]),
});
