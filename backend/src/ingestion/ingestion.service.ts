import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { FilesService } from "src/files/files.service";
import { InstanceImageService } from "src/instance-image/instance-image.service";
import { SeriesService } from "src/series/series.service";
import { StudyService } from "src/study/study.service";
import { UploadStudyDto } from "./dto/upload-study.dto";
import { Study } from "src/study/entities/study.entity";
import { Status } from "src/common/enums";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import FormData from "form-data";
import { Sequelize } from "sequelize-typescript";
import { StudyProcessedDto } from "./dto/study-processed.dto";

@Injectable()
export class IngestionService {
  constructor(
    private fileService: FilesService,
    private studyService: StudyService,
    private seriesService: SeriesService,
    private instanceImageService: InstanceImageService,
    private readonly http: HttpService,
    private readonly sequelize: Sequelize,
  ) {}

  async ingestionStudy(dicomZip: Express.Multer.File, studyId: number, studyPath: string) {
    const form = new FormData();

    form.append("archive", dicomZip.buffer, {
      filename: dicomZip.originalname,
      contentType: dicomZip.mimetype,
    });

    form.append("study_id", studyId);
    form.append("study_path", studyPath);

    const { data } = await firstValueFrom(
      this.http.post(`${process.env.COMPUTE_URL}/ingestion/upload-study`, form, {
        headers: form.getHeaders(),
      }),
    );

    return data;
  }

  async processStudy(dto: UploadStudyDto, dicomZip: Express.Multer.File) {
    let study: Study | null = null;

    try {
      study = await this.studyService.create({
        patientId: dto.patientId,
        note: dto.note,
        status: Status.Processing,
      });

      const data = await this.ingestionStudy(dicomZip, study.id, study.path);

      return data;
    } catch (error) {
      if (study) {
        await this.studyService.update(study.id, { status: Status.Failed });
      }
      const msg = `Ошибка при обработке исследования. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async completeStudyProcessing(data: StudyProcessedDto) {
    const transaction = await this.sequelize.transaction();

    try {
      await this.studyService.update(data.studyId, data.studyData, transaction);

      await this.seriesService.bulkCreate(data.processedSeries, transaction);

      await this.instanceImageService.bulkCreate(data.processedImages, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
}
