import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { enums } from "src/common/response";
import { IngestionCodes } from "../contracts";

export class UploadStudyDto {
  static validationCode = IngestionCodes.INGESTION_STUDY_ERROR;

  @ApiProperty({ example: 1, description: "Уникальный ID пациента" })
  @Type(() => Number)
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly patientId: number;

  @ApiProperty({ example: "Странные колени", description: "Заметка", required: false })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly note?: string;
}

