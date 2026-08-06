export enum PredictionRunCodes {
  CREATE_SUCCESS = "prediction_run.create.success",
  CREATE_ERROR = "prediction_run.create.error",

  FIND_ALL_SUCCESS = "prediction_run.findAll.success",
  FIND_ALL_ERROR = "prediction_run.findAll.error",

  FIND_ONE_SUCCESS = "prediction_run.findOne.success",
  FIND_ONE_ERROR = "prediction_run.findOne.error",

  FIND_ONE_OR_THROW_SUCCESS = "prediction_run.findOneOrThrow.success",
  FIND_ONE_OR_THROW_ERROR = "prediction_run.findOneOrThrow.error",

  UPDATE_SUCCESS = "prediction_run.update.success",
  UPDATE_ERROR = "prediction_run.update.error",

  REMOVE_SUCCESS = "prediction_run.remove.success",
  REMOVE_ERROR = "prediction_run.remove.error",

  FORCE_REMOVE_SUCCESS = "prediction_run.forceRemove.success",
  FORCE_REMOVE_ERROR = "prediction_run.forceRemove.error",

  RESTORE_SUCCESS = "prediction_run.restore.success",
  RESTORE_ERROR = "prediction_run.restore.error",

  FIND_ALL_BY_STUDY_ID_SUCCESS = "prediction_run.findAllByStudyId.success",
  FIND_ALL_BY_STUDY_ID_ERROR = "prediction_run.findAllByStudyId.error",

  FIND_ALL_PREDICTIONS_SUCCESS = "prediction_run.findAllPredictions.success",
  FIND_ALL_PREDICTIONS_ERROR = "prediction_run.findAllPredictions.error",
}
