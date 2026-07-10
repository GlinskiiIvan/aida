import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

REDIS_BROKER_URL = os.getenv("REDIS_BROKER_URL")
REDIS_RESULT_BACKEND = os.getenv("REDIS_RESULT_BACKEND")


BASE_DIR = Path("/app")
STORAGE_DIR = Path("/storage")
TMP_UPLOAD_DIR = STORAGE_DIR / "tmp" / "uploads"
