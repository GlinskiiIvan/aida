import uuid
import os

from src.core.config import TMP_UPLOAD_DIR

from fastapi import UploadFile, File, APIRouter
from typing import cast
from celery import Task
from fastapi import Form

from src.tasks.ingestion_study import upload_study_task

router = APIRouter(prefix="/ingestion", tags=["ingestion"])


@router.post(
    "/upload-study",
    summary="Загрузка DICOM исследования",
    description="""
        Загружает DICOM-исследование для последующей обработки, извлечения метаданных,
        формирования структуры исследования и запуска алгоритмов анализа.

        Метод принимает ZIP-архив, содержащий файлы исследования в формате DICOM.
        После загрузки создается фоновая задача, которая выполняет:
        - распаковку архива;
        - поиск и проверку DICOM-файлов;
        - группировку изображений по сериям;
        - извлечение метаданных исследования, серий и изображений;
        - сохранение информации в базе данных.

        Метод возвращает идентификатор фоновой задачи, позволяющий отслеживать
        ход выполнения обработки.

        Входные параметры:
        - user_id — идентификатор пользователя, загрузившего исследование;
        - archive — ZIP-архив, содержащий DICOM-файлы исследования.

        Важно:
        Архив должен содержать корректные DICOM-файлы хотя бы одной поддерживаемой серии.
    """,
    response_description="Идентификатор фоновой задачи обработки DICOM-исследования и информация о ее текущем статусе.",
)
async def upload_study(
    study_id: int = Form(...),
    study_path: int = Form(...),
    archive: UploadFile = File(None),
):
    dto = {
        "study_id": study_id,
        "study_path": study_path,
    }

    upload_dir = os.path.join(TMP_UPLOAD_DIR, f"{uuid.uuid4()}")
    os.makedirs(upload_dir, exist_ok=True)

    archive_path = None
    if archive:
        filename = archive.filename or ""
        ext = os.path.splitext(filename)[1]
        archive_path = os.path.join(upload_dir, f"{uuid.uuid4()}{ext}")
        with open(archive_path, "wb") as buffer:
            buffer.write(await archive.read())

    task = cast(Task, upload_study_task).delay(
        dto=dto, archive_path=archive_path, upload_dir=upload_dir
    )

    return {"task_id": task.id, "status": "processing"}
