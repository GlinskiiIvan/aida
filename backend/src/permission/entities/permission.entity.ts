import { ApiProperty } from '@nestjs/swagger';
import { BelongsToMany, Column, DataType, DeletedAt, Model, Table, } from 'sequelize-typescript';
import { RolePermission } from 'src/intermediary-tables/role-permission.entity';
import { Role } from 'src/roles/entities/role.entity';

interface TableCreationAttrs {
  readonly value: string;
  readonly description?: string;
}

@Table({ tableName: 'permission', paranoid: true })
export class Permission extends Model<Permission, TableCreationAttrs>{
  @ApiProperty({ example: 1, description: 'Уникальный ID' })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true, })
  id: number;

  @ApiProperty({ example: 'patient:create', description: 'Значение разрешения' })
  @Column({ type: DataType.STRING, unique: true, })
  value: string;

  @ApiProperty({ example: 'Разрешение на создание пациента', description: 'Описание разрешения', required: false, })
  @Column({ type: DataType.STRING, allowNull: true, defaultValue: null, })
  description?: string | null;

  @ApiProperty({ example: '2026-03-27T16:00:00.000Z', description: 'Дата удаления', required: false })
  @DeletedAt
  @Column({ type: DataType.DATE, allowNull: true, defaultValue: null, })
  declare deletedAt?: Date | null;

  @BelongsToMany(() => Role, () => RolePermission)
  roles: Role[];
}
