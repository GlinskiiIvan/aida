export enum PatientCodes {
  CREATE_SUCCESS = "patient.create.success",
  CREATE_ERROR = "patient.create.error",

  FIND_ALL_SUCCESS = "patient.findAll.success",
  FIND_ALL_ERROR = "patient.findAll.error",

  FIND_ALL_BY_DOCTOR_ID_SUCCESS = "patient.findAllByDoctorId.success",
  FIND_ALL_BY_DOCTOR_ID_ERROR = "patient.findAllByDoctorId.error",

  FIND_ONE_SUCCESS = "patient.findOne.success",
  FIND_ONE_ERROR = "patient.findOne.error",

  FIND_ONE_OR_THROW_SUCCESS = "patient.findOneOrThrow.success",
  FIND_ONE_OR_THROW_ERROR = "patient.findOneOrThrow.error",

  UPDATE_SUCCESS = "patient.update.success",
  UPDATE_ERROR = "patient.update.error",

  REMOVE_SUCCESS = "patient.remove.success",
  REMOVE_ERROR = "patient.remove.error",

  FORCE_REMOVE_SUCCESS = "patient.forceRemove.success",
  FORCE_REMOVE_ERROR = "patient.forceRemove.error",

  RESTORE_SUCCESS = "patient.restore.success",
  RESTORE_ERROR = "patient.restore.error",

  FIND_ALL_STUDIES_SUCCESS = "patient.findAllStudies.success",
  FIND_ALL_STUDIES_ERROR = "patient.findAllStudies.error",
}
