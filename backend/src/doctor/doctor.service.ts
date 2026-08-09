import { forwardRef, HttpStatus, Injectable, Inject } from "@nestjs/common";
import { CreateDoctorDto } from "./dto/create-doctor.dto";
import { UpdateDoctorDto } from "./dto/update-doctor.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Doctor } from "./entities/doctor.entity";
import { UsersService } from "src/users/users.service";
import { FindOptions } from "sequelize";
import { AppException } from "src/exceptions/app.exception";
import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { doctorQueryConfig, DoctorCodes } from "./contracts";
import { PatientService } from "src/patient/patient.service";

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor) private repository: typeof Doctor,
    @Inject(forwardRef(() => PatientService)) private patientService: PatientService,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
  ) {}

  async create(dto: CreateDoctorDto) {
    await this.userService.findOneOrThrow(dto.userId);
    const doctor = await this.repository.create({
      ...dto,
      birthDate: new Date(dto.birthDate),
    });

    const response = createResponse<Doctor, DoctorCodes>();
    return response.success(DoctorCodes.CREATE_SUCCESS).data(doctor).build();
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

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
  }

  async findAllPatients(id: number, params: QueryParams) {
    const doctor = await this.findOneOrThrow(id);
    const patients = await this.patientService.findAllByDoctorId(id, params);

    return patients;
  }

  async findOne(id: number) {
    const doctor = await this.findOneOrThrow(id);

    const response = createResponse<Doctor, DoctorCodes>();
    return response.success(DoctorCodes.FIND_ONE_SUCCESS).data(doctor).build();
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Doctor>, "where">) {
    const doctor = await this.repository.findByPk(id, options);
    if (!doctor) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: DoctorCodes.FIND_ONE_OR_THROW_ERROR,
      });
    }
    return doctor;
  }

  async findOneOrThrowByUserId(userId: number, options?: Omit<FindOptions<Doctor>, "where">) {
    const doctor = await this.repository.findOne({
      where: { userId },
      ...options,
    });
    if (!doctor) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: DoctorCodes.FIND_ONE_OR_THROW_BY_USER_ID_ERROR,
      });
    }
    return doctor;
  }

  async update(id: number, dto: UpdateDoctorDto) {
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
  }

  async remove(id: number) {
    await this.findOneOrThrow(id);
    await this.repository.destroy({ where: { id } });

    const response = createResponse<Boolean, DoctorCodes>();
    return response.success(DoctorCodes.REMOVE_SUCCESS).data(true).build();
  }

  async forceRemove(id: number) {
    await this.repository.destroy({ where: { id }, force: true });

    const response = createResponse<Boolean, DoctorCodes>();
    return response.success(DoctorCodes.FORCE_REMOVE_SUCCESS).data(true).build();
  }

  async restore(id: number) {
    await this.repository.restore({ where: { id } });

    const response = createResponse<Boolean, DoctorCodes>();
    return response.success(DoctorCodes.RESTORE_SUCCESS).data(true).build();
  }
}
