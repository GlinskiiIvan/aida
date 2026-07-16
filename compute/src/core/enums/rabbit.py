from enum import Enum


class Queue(str, Enum):
    STUDY = "study"
    INFERENCE = "inference"
    BACKEND = "backend"
    WORKER = "worker"


class Exchange(str, Enum):
    EVENTS = "events"
    STUDY = "study"
    INFERENCE = "inference"
    BACKEND = "backend"
    WORKER = "worker"


class RoutingKey(str, Enum):
    STUDY_PENDING = "study.pending"
    STUDY_PROCESSING = "study.processing"
    STUDY_COMPLETED = "study.completed"
    STUDY_FAILED = "study.failed"

    INFERENCE_REQUEST = "inference.request"
    INFERENCE_PENDING = "inference.pending"
    INFERENCE_PROCESSING = "inference.processing"
    INFERENCE_COMPLETED = "inference.completed"
    INFERENCE_FAILED = "inference.failed"
