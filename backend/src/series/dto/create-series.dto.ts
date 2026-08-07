import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNumber } from "class-validator";
import { enums } from "src/common/response";
import { SeriesCodes } from "../contracts";

export class CreateSeriesDto {
  static validationCode = SeriesCodes.CREATE_ERROR;

  @ApiProperty({
    example: "0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21",
    description: "Уникальный ID серии",
  })
  @IsUUID("7", { context: { code: enums.ValidationCodes.UUID } })
  readonly id: string;

  @ApiProperty({
    example: "0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21",
    description: "Уникальный ID исследования",
  })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly studyId: number;
}
