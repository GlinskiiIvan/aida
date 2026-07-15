import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNumber } from "class-validator";

export class CreateSeriesDto {
  @ApiProperty({
    example: "0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21",
    description: "Уникальный ID серии",
  })
  @IsUUID("7", { message: "id должен быть корректным UUIDv7" })
  readonly id: string;

  @ApiProperty({
    example: "0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21",
    description: "Уникальный ID исследования",
  })
  @IsNumber({}, { message: "studyId должен быть числом" })
  readonly studyId: number;
}
