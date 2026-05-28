import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from './entities/permission.entity';
import { buildOrder, buildResultData, buildWhere, FindAllServiceParams } from 'src/utils';
import { FindOptions } from 'sequelize';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission) private repository: typeof Permission
  ) {}

  async create(dto: CreatePermissionDto) {
    try {
      const permission = await this.repository.create(dto);
      return permission;
    } catch (error) {
        const msg = `Ошибка при создании разрешения. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: FindAllServiceParams) {
    try {
      const whereParams = buildWhere<Permission>({
        dateFrom: params.dateFrom,
        dateTo: params.dateTo,
        filterBy: params.filterBy,
        filterValue: params.filterValue,
      });
      const orderParams = buildOrder({
        sortBy: params.sortBy, 
        sortOrder: params.sortOrder
      });

      const { rows: studies, count } = await this.repository.findAndCountAll({
        where: whereParams,
        order: orderParams,
        limit: params.pageSize || undefined,
        offset: params.offset || undefined,
      });

      return buildResultData<Permission>({
        rows: studies,
        page: params.page,
        limit: params.pageSize,
        count,
      });
    } catch (error) {
        const msg = `Ошибка при получении всех разрешений. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Permission>, "where">) {
    const permission = await this.repository.findByPk(id, options);
    if(!permission) {
      throw new HttpException(`Разрешение не найдено.`, HttpStatus.NOT_FOUND);
    }
    return permission;
  }

  async findOne(id: number) {
    try {
      const permission = await this.findOneOrThrow(id);
      return permission; 
    } catch (error) {
        const msg = `Ошибка при получении разрешения по id. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByValue(value: string) {
    try {
      const permission = await this.repository.findOne({ where: {value} });
      if(!permission) {
        throw new HttpException(`Разрешение не найдено.`, HttpStatus.NOT_FOUND);
      }
      return permission;
    } catch (error) {
        const msg = `Ошибка при получении разрешения по значению. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdatePermissionDto) {
    try {
      await this.findOneOrThrow(id);
      const [_, updatedRows] = await this.repository.update(
        {
          ...dto, 
        }, {
          where: {id}, 
          returning: true
        }
      );
      return updatedRows[0]; 
    } catch (error) {
        const msg = `Ошибка при обновлении разрешения. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.repository.restore({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при восстановлении разрешения после мягкого удаления. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({where: {id}, force: true});
      return true;
    } catch (error) {
        const msg = `Ошибка при жестком удалении разрешения. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  } 

  async restore(id: number) {
    try {
      await this.repository.restore({where: {id}});
      return true;
    } catch (error) {
        const msg = `Ошибка при восстановлении разрешения после мягкого удаления. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async count() {
    try {
      return (await this.repository.findAndCountAll()).count;
    } catch (error) {
        const msg = `Ошибка подсчете разрешений. ${error.message}`;
        console.log(msg);
        throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
