import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { enums } from "src/common/response";
import { UserCodes } from "../contracts";

export class UserBanDto {
  static validationCode = UserCodes.BAN_ERROR;

  @ApiProperty({ example: 1, description: "ID пользователя" })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly userId: number;

  @ApiProperty({ example: "За хулиганство", description: "Причина бана" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly banReason: string;
}
