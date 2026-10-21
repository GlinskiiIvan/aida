import { ApiProperty } from "@nestjs/swagger";
import {
  BelongsTo,
  Column,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { Doctor } from "src/doctor/entities/doctor.entity";
import { Study } from "src/study/entities/study.entity";

interface TableCreationAttrs {
  readonly doctorId: number;
  readonly code: string;
  readonly note?: string;
}

@Table({ tableName: "patient", paranoid: true })
export class Patient extends Model<Patient, TableCreationAttrs> {
  @ApiProperty({ example: 1, description: "Уникальный ID пациента" })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  // Внешний ключ укзаывающий на доктора
  @ApiProperty({ example: 1, description: "Уникальный ID доктора" })
  @ForeignKey(() => Doctor)
  @Column({ type: DataType.INTEGER })
  doctorId: number;

  // Связь один ко многим с доктором
  @BelongsTo(() => Doctor)
  doctor: Doctor;

  @ApiProperty({
    example: "P-2026-000123",
    description: "Уникальный код пациента (без персональных данных)",
  })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  code: string;

  @ApiProperty({ example: false, description: "Флаг публичности" })
  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isPublic: boolean;

  @ApiProperty({ example: "Странные колени", description: "Заметка", required: false })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null })
  note?: string | null;

  @ApiProperty({
    example: "2026-03-27T16:00:00.000Z",
    description: "Дата удаления",
    required: false,
  })
  @DeletedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null })
  declare deletedAt?: Date | null;

  // Один пациент - много исследований
  @HasMany(() => Study)
  studies: Study[];
}
