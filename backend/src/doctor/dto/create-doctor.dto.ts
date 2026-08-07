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
import { DoctorCodes } from "../contracts";

export class CreateDoctorDto {
  static validationCode = DoctorCodes.CREATE_ERROR;

  @ApiProperty({ example: 1, description: "Уникальный ID пользователя" })
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly userId: number;

  @ApiProperty({
    example: "Глинский Иван Николаевич",
    description: "Полное имя",
  })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly fullName: string;

  @ApiProperty({ example: "1894-10-04", description: "Дата рождения" })
  @IsDateString({}, { context: { code: enums.ValidationCodes.DATE } })
  readonly birthDate: string;

  @ApiProperty({
    example: "male",
    description: "Пол",
    enum: ["male", "female"],
  })
  @IsEnum(Gender, { context: { code: enums.ValidationCodes.ENUM } })
  readonly gender: Gender;

  @ApiProperty({ example: "+77714563464", description: "Номер телефона" })
  @IsPhoneNumber("KZ", { context: { code: enums.ValidationCodes.PHONE } })
  readonly phone: string;

  @ApiProperty({
    example: "doctor@mail.ru",
    description: "Email для связи",
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { context: { code: enums.ValidationCodes.EMAIL } })
  readonly contactEmail?: string;

  @ApiProperty({ example: "Ортопедия", description: "Специализация" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly specialization: string;

  @ApiProperty({ example: "Хирургическое", description: "Отделение" })
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly department: string;

  @ApiProperty({
    example: "KN-202345",
    description: "Номер лицензии",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly licenseNumber?: string;

  @ApiProperty({
    example: "Опыт работы 10 лет, специализация на коленных операциях",
    description: "Заметка",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly note?: string;
}
