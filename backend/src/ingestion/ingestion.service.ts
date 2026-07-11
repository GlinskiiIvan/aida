import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/files.service';
import { InstanceImageService } from 'src/instance-image/instance-image.service';
import { SeriesService } from 'src/series/series.service';
import { StudyService } from 'src/study/study.service';
import { UploadStudyDto } from './dto/upload-study.dto';
import { Study } from 'src/study/entities/study.entity';
import { Status } from 'src/common/enums';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import FormData from 'form-data';

@Injectable()
export class IngestionService {
    constructor(
        private fileService: FilesService,
        private studyService: StudyService,
        private seriesService: SeriesService,
        private instanceImageService: InstanceImageService,
        private readonly http: HttpService,
    ) {}

    async ingestionStudy(dicomZip: Express.Multer.File) {
        const form = new FormData();

        form.append('archive', dicomZip.buffer, {
            filename: dicomZip.originalname,
            contentType: dicomZip.mimetype,
        });

        form.append('study_id', '0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21');
        form.append('study_path', '/storage/patients/2/studies/0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21');

        const { data } = await firstValueFrom(
            this.http.post(
                `${process.env.COMPUTE_URL}/ingestion/upload-study`,
                form,
                {
                    headers: form.getHeaders(),
                },
            ),
        );

        return data;
    }

    async processStudy(dto: UploadStudyDto, dicomZip: Express.Multer.File) {
        let study: Study | null = null;

        try {
            study = await this.studyService.create({
                patientId: dto.patientId,
                note: dto.note,
            });
            await this.studyService.update(study.id, {status: Status.Processing});

            const data = await this.ingestionStudy(dicomZip);
            
            return data;
        } catch (error) {
            if(study) {
                await this.studyService.update(study.id, {status: Status.Failed});
            }
            const msg = `Ошибка при обработке исследования. ${error.message}`;
            console.log(msg);
            throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
        }
    }
}
