import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'patient:create', description: 'Значение разрешения' })
  @IsString({ message: 'Должно быть строкой' })
  readonly value: string;

  @ApiProperty({ example: 'Разрешение на создание пациента', description: 'Описание разрешения', required: false})
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  readonly description?: string;
}
