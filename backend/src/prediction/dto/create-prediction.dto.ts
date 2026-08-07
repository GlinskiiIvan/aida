import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { enums } from "src/common/response";
import { PredictionCodes } from "../contracts";

export class CreatePredictionDto {
  static validationCode = PredictionCodes.CREATE_ERROR;

  @ApiProperty({ example: 1, description: "Уникальный ID запуска" })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly runId: number;

  @ApiProperty({
    example: "0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21",
    description: "Уникальный ID изображения",
  })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly imageId: number;
}
