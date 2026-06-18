import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';

export class UpdatePermissionsDto {
  @ApiProperty({ example: [1,2,3,4,5], description: 'Массив разрешений роли', type: [Number] })
  @IsArray()
  @IsInt({each: true})
  readonly permissions: number[];
}
