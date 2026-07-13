from enum import Enum


class Task(str, Enum):
    UPLOAD_STUDY = "upload_study"
    INFERENCE_STUDY = "inference_study"


class SubTask(str, Enum):
    DOWNLOAD_IMAGE_COLLECTION = "download_image_collection"
