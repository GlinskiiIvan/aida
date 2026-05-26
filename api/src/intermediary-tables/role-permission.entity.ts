import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { Permission } from 'src/permission/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';

@Table({ tableName: 'role_permission' })
export class RolePermission extends Model<RolePermission> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  role_id: number;

  @ForeignKey(() => Permission)
  @Column({ type: DataType.INTEGER })
  permission_id: number;
}
