import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsNumber, IsString } from "class-validator";

export class CreatePredictionRunDto {
    @ApiProperty({
        example: '0197f3f7-8d9b-7f4a-b2c1-5d8e9a7c4f21',
        description: 'Уникальный ID исследования',
    })
    @IsUUID('7', { message: 'studyId должен быть корректным UUIDv7' })
    readonly studyId: string;

    @ApiProperty({ example: 1, description: 'Уникальный ID того кто запустил предсказание' })
    @IsNumber({}, { message: 'createdById должен быть числом' })
    readonly createdById: number;

    @ApiProperty({ example: 'YOLO', description: 'Модель' })
    @IsString({ message: 'model должна быть строкой' })
    readonly model: string;

    @ApiProperty({ example: '8l', description: 'Версия' })
    @IsString({ message: 'version должна быть строкой' })
    readonly version: string;
}
