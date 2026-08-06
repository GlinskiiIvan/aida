export enum PredictionCodes {
  CREATE_SUCCESS = "prediction.create.success",
  CREATE_ERROR = "prediction.create.error",

  FIND_ALL_SUCCESS = "prediction.findAll.success",
  FIND_ALL_ERROR = "prediction.findAll.error",

  FIND_ONE_SUCCESS = "prediction.findOne.success",
  FIND_ONE_ERROR = "prediction.findOne.error",

  FIND_ONE_OR_THROW_SUCCESS = "prediction.findOneOrThrow.success",
  FIND_ONE_OR_THROW_ERROR = "prediction.findOneOrThrow.error",

  UPDATE_SUCCESS = "prediction.update.success",
  UPDATE_ERROR = "prediction.update.error",

  REMOVE_SUCCESS = "prediction.remove.success",
  REMOVE_ERROR = "prediction.remove.error",

  FORCE_REMOVE_SUCCESS = "prediction.forceRemove.success",
  FORCE_REMOVE_ERROR = "prediction.forceRemove.error",

  RESTORE_SUCCESS = "prediction.restore.success",
  RESTORE_ERROR = "prediction.restore.error",

  BULK_CREATE_SUCCESS = "prediction.bulkCreate.success",
  BULK_CREATE_ERROR = "prediction.bulkCreate.error",

  FIND_ALL_BY_IMAGE_ID_SUCCESS = "prediction.findAllByImageId.success",
  FIND_ALL_BY_IMAGE_ID_ERROR = "prediction.findAllByImageId.error",

  FIND_ALL_BY_RUN_ID_SUCCESS = "prediction.findAllByRunId.success",
  FIND_ALL_BY_RUN_ID_ERROR = "prediction.findAllByRunId.error",
}
