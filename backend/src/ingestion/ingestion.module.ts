import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { StudyModule } from 'src/study/study.module';
import { SeriesModule } from 'src/series/series.module';
import { InstanceImageModule } from 'src/instance-image/instance-image.module';
import { FilesModule } from 'src/files/files.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [IngestionController],
  providers: [IngestionService],
  imports: [FilesModule, StudyModule, SeriesModule, InstanceImageModule, HttpModule],
  exports: [IngestionService]
})
export class IngestionModule {}
