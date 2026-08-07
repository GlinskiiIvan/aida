import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { enums } from "src/common/response";
import { PredictionRunCodes } from "../contracts";

export class CreatePredictionRunDto {
  static validationCode = PredictionRunCodes.CREATE_ERROR;

  @ApiProperty({
    example: 1,
    description: "Уникальный ID исследования",
  })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly studyId: number;

  @ApiProperty({ example: 1, description: "Уникальный ID того кто запустил предсказание" })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly createdById: number;

  @ApiProperty({ example: "YOLO", description: "Модель" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly model: string;

  @ApiProperty({ example: "8l", description: "Версия" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly version: string;
}
