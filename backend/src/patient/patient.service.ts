import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreatePatientDto } from "./dto/create-patient.dto";
import { UpdatePatientDto } from "./dto/update-patient.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Patient } from "./entities/patient.entity";
import { DoctorService } from "src/doctor/doctor.service";
import { FindOptions } from "sequelize";
import { StudyService } from "src/study/study.service";

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
    try {
      const doctor = await this.doctorService.findOneOrThrowByUserId(userId);

      const patient = await this.repository.create({
        ...dto,
        birthDate: new Date(dto.birthDate),
        doctorId: doctor.id,
      });

      const response = createResponse<Patient, PatientCodes>();
      return response.success(PatientCodes.CREATE_SUCCESS).data(patient).build();
    } catch (error) {
      const msg = `Ошибка при создании пациента. ${error.message}`;
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
    } catch (error) {
      const msg = `Ошибка при получении всех пациентов. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllByDoctorId(doctorId: number, params: QueryParams) {
    console.log("params: ", params);

    try {
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
    } catch (error) {
      const msg = `Ошибка при получении всех пациентов. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findAllStudies(id: number, params: QueryParams) {
    try {
      const patient = await this.findOneOrThrow(id);
      const studies = await this.studyService.findAllByPatientId(id, params);

      return studies;
    } catch (error) {
      const msg = `Ошибка при получении всех исследований пациента. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async findOneOrThrow(id: number, options?: Omit<FindOptions<Patient>, "where">) {
    const patient = await this.repository.findByPk(id, options);
    if (!patient) {
      throw new HttpException(`Пациент не найден.`, HttpStatus.NOT_FOUND);
    }
    return patient;
  }

  async findOne(id: number) {
    try {
      const patient = await this.findOneOrThrow(id);

      const response = createResponse<Patient, PatientCodes>();
      return response.success(PatientCodes.FIND_ONE_SUCCESS).data(patient).build();
    } catch (error) {
      const msg = `Ошибка при получении пациента. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, dto: UpdatePatientDto) {
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

      const response = createResponse<Patient, PatientCodes>();
      return response.success(PatientCodes.UPDATE_SUCCESS).data(updatedRows[0]).build();
    } catch (error) {
      const msg = `Ошибка при обновлении пациента. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.findOneOrThrow(id);
      await this.repository.destroy({ where: { id } });

      const response = createResponse<Boolean, PatientCodes>();
      return response.success(PatientCodes.REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при мягком удалении пациента. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async forceRemove(id: number) {
    try {
      await this.repository.destroy({ where: { id }, force: true });

      const response = createResponse<Boolean, PatientCodes>();
      return response.success(PatientCodes.FORCE_REMOVE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при жестком удалении пациента. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  async restore(id: number) {
    try {
      await this.repository.restore({ where: { id } });

      const response = createResponse<Boolean, PatientCodes>();
      return response.success(PatientCodes.RESTORE_SUCCESS).data(true).build();
    } catch (error) {
      const msg = `Ошибка при востановлении пациента. ${error.message}`;
      console.log(msg);
      throw new HttpException(msg, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
