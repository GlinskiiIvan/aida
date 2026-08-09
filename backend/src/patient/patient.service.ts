import { forwardRef, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Patient } from "./entities/patient.entity";
import { DoctorService } from "src/doctor/doctor.service";
import { FindOptions } from "sequelize";
import { StudyService } from "src/study/study.service";

import { AppException } from "src/exceptions/app.exception";
import { QueryParams, executeQueryResponse } from "../common/query";
import { createResponse } from "../common/response";
import { patientQueryConfig, PatientCodes } from "./contracts";

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient) private repository: typeof Patient,
    @Inject(forwardRef(() => StudyService)) private studyService: StudyService,
    @Inject(forwardRef(() => DoctorService)) private doctorService: DoctorService,
  ) {}

  async create(dto: CreatePatientDto, userId: number) {
    const doctor = await this.doctorService.findOneOrThrowByUserId(userId);

    const patient = await this.repository.create({
      ...dto,
      birthDate: new Date(dto.birthDate),
      doctorId: doctor.id,
    });

    const response = createResponse<Patient, PatientCodes>();
    return response.success(PatientCodes.CREATE_SUCCESS).data(patient).build();
  }

  async findAll(params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      order: [["created_at", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      patientQueryConfig,
      params,
      options,
    );

    const response = createResponse<Patient[], PatientCodes>();
    return response
      .success(PatientCodes.FIND_ALL_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findAllByDoctorId(doctorId: number, params: QueryParams) {
    console.log("params: ", params);

    let options: FindOptions = {
      where: { doctorId },
      order: [["created_at", "DESC"]],
    };

    const { data, resolvedPageination } = await executeQueryResponse(
      this.repository,
      patientQueryConfig,
      params,
      options,
    );

    const response = createResponse<Patient[], PatientCodes>();
    return response
      .success(PatientCodes.FIND_ALL_BY_DOCTOR_ID_SUCCESS)
      .data(data)
      .pagination(
        resolvedPageination.total,
        resolvedPageination.page_size,
        resolvedPageination.page,
      )
      .build();
  }

  async findAllStudies(id: number, params: QueryParams) {
    const patient = await this.findOneOrThrow(id);
    const studies = await this.studyService.findAllByPatientId(id, params);

    return studies;
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Patient>, "where">) {
    const patient = await this.repository.findByPk(id, options);
    if (!patient) {
      throw new AppException({
        status: HttpStatus.NOT_FOUND,
        code: PatientCodes.FIND_ONE_OR_THROW_ERROR,
      });
    }
    return patient;
  }

  async findOne(id: number) {
    const patient = await this.findOneOrThrow(id);

    const response = createResponse<Patient, PatientCodes>();
    return response.success(PatientCodes.FIND_ONE_SUCCESS).data(patient).build();
  }

  async update(id: number, dto: UpdatePatientDto) {
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

    const response = createResponse<Patient, PatientCodes>();
    return response.success(PatientCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
  }

  async remove(id: number) {
    await this.findOneOrThrow(id);
    await this.repository.destroy({ where: { id } });

    const response = createResponse<Boolean, PatientCodes>();
    return response.success(PatientCodes.REMOVE_SUCCESS).data(true).build();
  }

  async forceRemove(id: number) {
    await this.repository.destroy({ where: { id }, force: true });

    const response = createResponse<Boolean, PatientCodes>();
    return response.success(PatientCodes.FORCE_REMOVE_SUCCESS).data(true).build();
  }

  async restore(id: number) {
    await this.repository.restore({ where: { id } });

    const response = createResponse<Boolean, PatientCodes>();
    return response.success(PatientCodes.RESTORE_SUCCESS).data(true).build();
  }
}
