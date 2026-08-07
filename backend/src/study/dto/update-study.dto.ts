import { ApiProperty, OmitType, PartialType } from "@nestjs/swagger";
import { CreateStudyDto } from "./create-study.dto";
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Modality, Status } from "src/common/enums";
import { enums } from "src/common/response";
import { StudyCodes } from "../contracts";

export class UpdateStudyDto extends PartialType(OmitType(CreateStudyDto, ["patientId"])) {
  static validationCode = StudyCodes.UPDATE_ERROR;

  @ApiProperty({
    example: "1.2.840.113619.2.312.6945.201972.14618.1691291532.417",
    description: "Уникальный ID пациента",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly studyInstanceUID?: string | null;

  @ApiProperty({
    example: "2345",
    description: "Опциональный идентификатор исследования, присвоенный системой (Study ID)",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly studyId?: string | null;

  @ApiProperty({
    example: "ISO_IR 100",
    description: "Кодировка символов, используемая в DICOM файле (Specific Character Set)",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly specificCharacterSet?: string | null;

  @ApiProperty({
    example: "2026-03-27T15:05:29.277+06:00",
    description: "Дата и время прохождения исследования",
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { context: { code: enums.ValidationCodes.DATE } })
  readonly studyDateTime?: string | null;

  @ApiProperty({
    example: Modality.MR,
    description: "Модальность исследования",
    enum: Object.values(Modality),
    required: false,
  })
  @IsOptional()
  @IsEnum(Modality, { context: { code: enums.ValidationCodes.ENUM } })
  readonly modality?: Modality | null;

  @ApiProperty({
    example: "Представим, что это описание всего исследования.",
    description: "Описание",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly description?: string | null;

  @ApiProperty({
    example: "TESLA-MED",
    description: "Название учреждения, где проводилось исследование (Institution Name)",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly institutionName?: string | null;

  @ApiProperty({
    example: "GE MEDICAL SYSTEMS",
    description: "Производитель оборудования для исследования (Manufacturer)",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly manufacturer?: string | null;

  @ApiProperty({
    example: "Signa HDxt",
    description: "Модель аппарата, использованного для исследования (Manufacturer's Model Name)",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly manufacturersModelName?: string | null;

  @ApiProperty({
    example: "GEHCGEHC",
    description: "Имя станции (Station Name) или идентификатор сканера",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly stationName?: string | null;

  @ApiProperty({
    example: "",
    description: "Имя направившего врача (Referring Physician's Name)",
    required: false,
  })
  @IsOptional()
  @IsString({ context: { code: enums.ValidationCodes.STRING } })
  readonly referringPhysiciansName?: string | null;

  @ApiProperty({ example: 5, description: "Количество серий в исследовании", required: false })
  @IsOptional()
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly seriesCount?: number | null;

  @ApiProperty({
    example: 5,
    description: "Количество изображений в исследовании",
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { context: { code: enums.ValidationCodes.NUMBER } })
  readonly imagesCount?: number | null;
}
