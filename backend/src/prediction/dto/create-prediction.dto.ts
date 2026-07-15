import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNumber } from "class-validator";

export class CreatePredictionDto {
  @ApiProperty({ example: 1, description: "Уникальный ID запуска" })
  @IsNumber({}, { message: "runId должен быть числом" })
  readonly runId: number;

  @ApiProperty({
    example: "0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21",
    description: "Уникальный ID изображения",
  })
  @IsNumber({}, { message: "imageId должен быть числом" })
  readonly imageId: number;
}
