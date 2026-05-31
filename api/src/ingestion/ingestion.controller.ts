import { Body, Controller, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadStudyDto } from './dto/upload-study.dto';

@ApiBearerAuth('token')
@ApiTags('Вход данных')
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @ApiOperation({ summary: 'Загрузка dicom архива (исследования)' })
  @ApiResponse({ status: 200, type: Boolean })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
      schema: {
          type: 'object',
          properties: {
              patientId: {
                  type: 'number',
              },
              dicomZip: {
                  type: 'string',
                  format: 'binary',
              },
              note: {
                  type: 'string',
              },
          },
      },
  })
  @Permissions('ingestion:upload')
  @UseGuards(PermissionsGuard)
  @UseInterceptors(FileInterceptor('dicomZip'))
  @Post('/upload/study')
  processStudy(@Body() dto: UploadStudyDto, @UploadedFile() dicomZip) {
    console.log('UploadStudyDto', dto);
    
    return this.ingestionService.processStudy(dto, dicomZip)
  }
}
