from enum import Enum

class Status(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    PARTIAL = "partial"
    EMPTY = "empty"
    SKIPPED = "skipped"
