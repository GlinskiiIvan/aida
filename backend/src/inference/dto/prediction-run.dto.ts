import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { enums } from "src/common/response";
import { InferenceCodes } from "../contracts";

export class PredictionRunDto {
  static validationCode = InferenceCodes.PREDICT_ERROR;

  @ApiProperty({ example: "YOLO-bbox", description: "ИИ модель" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly model: string;

  @ApiProperty({ example: "8x", description: "Версия модели" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly version: string;
}

