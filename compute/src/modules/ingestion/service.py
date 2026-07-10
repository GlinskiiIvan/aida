from src.core.enums.status import Status

from .utils.extract_archive import extract_archive
from .utils.parse_series import parse_series
from .utils.process_series import process_series
from .schema import UploadStudyDTO

from src.core.rabbit import publisher as rabbit_publisher
from src.core.enums import rabbit


async def upload_study(dto: UploadStudyDTO):
    extracted_study_path = await extract_archive(
        study_path=dto.study_path,
        archive_path=dto.archive_path,
    )

    series_list, study_metadata = parse_series(
        study_dir=extracted_study_path,
    )

    processed_series, processed_images = await process_series(
        study_id=dto.study_id,
        study_path=dto.study_path,
        series_list=series_list,
    )

    if study_metadata is None:
        raise RuntimeError("Study metadata not found")

    study_data = {
        **study_metadata,
        "status": Status.COMPLETED,
        "seriesCount": len(processed_series),
        "imagesCount": len(processed_images),
    }

    data = {
        "studyData": study_data,
        "processedSeries": processed_series,
        "processedImages": processed_images,
    }

    await rabbit_publisher.publish(
        routing_key=rabbit.RoutingKey.STUDY_COMPLETED, body=data
    )
