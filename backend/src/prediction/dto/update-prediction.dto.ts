import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreatePredictionDto } from "./create-prediction.dto";
import { IsArray, IsEnum, IsNumber, IsOptional } from "class-validator";
import { ResultClass, Status } from "src/common/enums";
import { BBox } from "src/types";
import { enums } from "src/common/response";
import { PredictionCodes } from "../contracts";

export class UpdatePredictionDto extends PartialType(
  OmitType(CreatePredictionDto, ["runId", "imageId"]),
) {
  static validationCode = PredictionCodes.UPDATE_ERROR;

  @ApiProperty({
    example: Status.Pending,
    description: "Статус обработки",
    enum: Object.values(Status),
    required: false,
  })
  @IsOptional()
  @IsEnum(Status, { context: { code: enums.ValidationCodes.ENUM } })
  readonly status?: Status;

  @ApiProperty({
    example: ResultClass.Tear,
    description: "Класс",
    enum: Object.values(ResultClass),
    required: false,
  })
  @IsOptional()
  @IsEnum(ResultClass, { context: { code: enums.ValidationCodes.ENUM } })
  readonly resultClass?: ResultClass | null;

  @ApiProperty({ example: 0.97, description: "Максимальная точность", required: false })
  @IsOptional()
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly maxConfidence?: number | null;

  @ApiProperty({ example: 0.89, description: "Минимальная точность", required: false })
  @IsOptional()
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly minConfidence?: number | null;

  @ApiProperty({ example: 89, description: "Время выполнения в ms", required: false })
  @IsOptional()
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly executionTime?: number | null;

  @ApiProperty({
    example: [
      {
        class: ResultClass.Normal,
        confidence: 0.97,
        bbox: { x: 0.32, y: 0.47, width: 0.15, height: 0.12 } as BBox,
      },
      {
        class: ResultClass.Tear,
        confidence: 0.95,
        bbox: { x: 0.49, y: 0.5, width: 0.12, height: 0.1 } as BBox,
      },
    ],
    description:
      "Результаты работы модели. Поле является универсальным и может содержать произвольную JSON-структуру в зависимости от используемой модели (например, bounding boxes, сегментации, ключевые точки и др.). Конкретный формат определяется типом модели и её версией. В данном примере bbox представлен в формате { x: number; y: number; width: number; height: number; } в нормализованных координатах (0–1).",
    type: "array",
    required: false,
  })
  @IsOptional()
  @IsArray({ context: { code: enums.ValidationCodes.ARRAY } })
  readonly rawOutput?: JSON[] | null;
}
