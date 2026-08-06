import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Doctor } from "./entities/doctor.entity";
import { UsersService } from "src/users/users.service";
import { FindOptions } from "sequelize";

import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { doctorQueryConfig, DoctorCodes } from "./contracts";
import { PatientService } from "src/patient/patient.service";

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor) private repository: typeof Doctor,
    private userService: UsersService,
    private patientService: PatientService,
  ) {}

  async create(dto: CreateDoctorDto) {
    try {
      await this.userService.findOneOrThrow(dto.userId);
      const doctor = await this.repository.create({
        ...dto,
        birthDate: new Date(dto.birthDate),
      });

      const response = createResponse<Doctor, DoctorCodes>();
      return response.success(DoctorCodes.CREATE_SUCCESS).data(doctor).build();
    } catch (error) {
      const msg = `Ошибка при создании доктора. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    try {
      let options: FindOptions = {
        order: [["created_at", "DESC"]],
      };

      const { data, resolvedPageination } = await executeQueryResponse(
        this.repository,
        doctorQueryConfig,
        params,
        options,
      );

      const response = createResponse<Doctor[], DoctorCodes>();
      return response
        .success(DoctorCodes.FIND_ALL_SUCCESS)
        .data(data)
        .pagination(
          resolvedPageination.total,
          resolvedPageination.page_size,
          resolvedPageination.page,
        )
        .build();
    } catch (error) {
      const msg = `Ошибка при получении всех докторов. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllPatients(id: number, params: QueryParams) {
    try {
      const doctor = await this.findOneOrThrow(id);
      const patients = await this.patientService.findAllByDoctorId(id, params);

      return patients;
    } catch (error) {
      const msg = `Ошибка при получении всех пациентов доктора. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    try {
      const doctor = await this.findOneOrThrow(id);

      const response = createResponse<Doctor, DoctorCodes>();
      return response.success(DoctorCodes.FIND_ONE_SUCCESS).data(doctor).build();
    } catch (error) {
      const msg = `Ошибка при получении доктора по id. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Doctor>, "where">) {
    const doctor = await this.repository.findByPk(id, options);
    if (!doctor) {
      throw new HttpException("Доктор не найден", HttpStatus.NOT_FOUND);
    }
    return doctor;
  }

  async findOneOrThrowByUserId(userId: number, options?: Omit<FindOptions<Doctor>, "where">) {
    const doctor = await this.repository.findOne({
      where: { userId },
      ...options,
    });
    if (!doctor) {
      throw new HttpException("Доктор не найден", HttpStatus.NOT_FOUND);
    }
    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto) {
    try {
      await this.findOneOrThrow(id);

      const [_, updatedRows] = await this.repository.update(
        {
          ...dto,
          birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        },
        {
          where: { id },
          returning: true,
        },
      );

      const response = createResponse<Doctor, DoctorCodes>();
      return response.success(DoctorCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
    } catch (error) {
      const msg = `Ошибка при обновлении доктора. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({ where: { id } });

      const response = createResponse<Boolean, DoctorCodes>();
      return response.success(DoctorCodes.REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при мягком удалении доктора. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: { id }, force: true });

      const response = createResponse<Boolean, DoctorCodes>();
      return response.success(DoctorCodes.FORCE_REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при жестком удалении доктора. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: { id } });

      const response = createResponse<Boolean, DoctorCodes>();
      return response.success(DoctorCodes.RESTORE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при востановлении доктора после мягкого удаления. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
