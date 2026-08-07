import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength, MaxLength } from "class-validator";
import { enums } from "src/common/response";
import { UserCodes } from "../contracts";

export class CreateUserDto {
  static validationCode = UserCodes.CREATE_ERROR;

  @ApiProperty({
    example: "example@mail.ru",
    description: "Email пользователя",
  })
  @IsString({ message: "Должно быть строкой" })
  @IsEmail({}, { context: { code: enums.ValidationCodes.EMAIL } })
  readonly email: string;

  @ApiProperty({ example: "Example1@", description: "Пароль пользователя" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  @MinLength(4, {
    context: { code: enums.ValidationCodes.MIN_LENGTH },
  })
  @MaxLength(16, {
    context: { code: enums.ValidationCodes.MAX_LENGTH },
  })
  readonly password: string;
}
