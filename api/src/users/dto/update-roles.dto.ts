import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';

export class UpdateRolesDto {
  @ApiProperty({ example: [1,2,3,4,5], description: 'Массив ролей пользователя', type: [Number] })
  @IsArray()
  @IsInt({each: true})
  readonly roles: number[];
}
