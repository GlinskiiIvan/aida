import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { IngestionService } from "./ingestion.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Permissions } from "src/decorators/permissions.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadStudyDto } from "./dto/upload-study.dto";
import { OperationCode } from "src/decorators/operation-code.decorator";
import { IngestionCodes } from "./contracts";

@ApiBearerAuth("token")
@ApiTags("Вход данных")
@Controller("ingestion")
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @ApiOperation({ summary: "Загрузка dicom архива (исследования)" })
  @ApiResponse({ status: 200, type: Boolean })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        patientId: {
          type: "number",
        },
        dicomZip: {
          type: "string",
          format: "binary",
        },
        note: {
          type: "string",
        },
      },
    },
  })
  @Permissions("ingestion:upload")
  @UseInterceptors(FileInterceptor("dicomZip"))
  @OperationCode(IngestionCodes.PROCESS_STUDY_ERROR)
  @Post("/upload/study")
  processStudy(@Body() dto: UploadStudyDto, @UploadedFile() dicomZip) {
    console.log("UploadStudyDto", dto);

    return this.ingestionService.processStudy(dto, dicomZip);
  }
}
