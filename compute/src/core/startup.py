import os

from src.core.config import BASE_DIR, STORAGE_DIR, TMP_UPLOAD_DIR


def init_storage():
    for dir in [BASE_DIR, STORAGE_DIR, TMP_UPLOAD_DIR]:
        os.makedirs(dir, exist_ok=True)
