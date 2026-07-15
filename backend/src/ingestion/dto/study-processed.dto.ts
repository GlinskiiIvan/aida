import { InstanceImage } from "src/instance-image/entities/instance-image.entity";
import { Series } from "src/series/entities/series.entity";
import { UpdateStudyDto } from "src/study/dto/update-study.dto";

export class StudyProcessedDto {
  readonly studyId: number;
  readonly studyData: UpdateStudyDto;
  readonly processedSeries: Series[];
  readonly processedImages: InstanceImage[];
}

