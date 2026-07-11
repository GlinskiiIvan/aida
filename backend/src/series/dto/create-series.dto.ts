import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateSeriesDto {
    @ApiProperty({
        example: '0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21',
        description: 'Уникальный ID исследования',
    })
    @IsUUID('7', { message: 'studyId должен быть корректным UUIDv7' })
    readonly studyId: string;
}
