import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { Gender } from "src/common/enums";
import { enums } from "src/common/response";
import { PatientCodes } from "../contracts";

export class CreatePatientDto {
  static validationCode = PatientCodes.CREATE_ERROR;

  @ApiProperty({ example: "Глинский Иван Николаевич", description: "Полное имя" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly fullName: string;

  @ApiProperty({ example: "1894-10-04", description: "Дата рождения" })
  @IsDateString({}, { context: { code: enums.ValidationCodes.DATE } })
  readonly birthDate: string;

  @ApiProperty({ example: "male", description: "Пол", enum: Object.values(Gender) })
  @IsEnum(Gender, { context: { code: enums.ValidationCodes.ENUM } })
  readonly gender: Gender;

  @ApiProperty({ example: "+77714563464", description: "Номер телефона" })
  @IsPhoneNumber("KZ", { context: { code: enums.ValidationCodes.PHONE } })
  readonly phone: string;

  @ApiProperty({ example: "doctor@mail.ru", description: "Email для связи", required: false })
  @IsOptional()
  @IsEmail({}, { context: { code: enums.ValidationCodes.EMAIL } })
  readonly email?: string;

  @ApiProperty({ example: "Странные колени", description: "Заметка", required: false })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly note?: string;
}
