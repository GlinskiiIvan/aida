import uuid

from src.core.enums.status import Status
from . import get_orientation
from .get_protocol import get_protocol_name
from .convert_image import convert_dicom_to_png
from .metadata_aggregator import aggregate_metadata

from uuid6 import uuid7

from pathlib import Path
from collections import defaultdict


async def process_series(
    study_id: uuid.UUID,
    study_path: Path,
    series_list: defaultdict[str, list[str]],
):
    last_image_data = None
    processed_series = []
    processed_images = []

    try:
        for index, (_, image_paths) in enumerate(series_list.items(), start=1):
            id = uuid7()

            series_path = Path(study_path) / "series" / f"{id}"
            series_path.mkdir(parents=True, exist_ok=True)

            results = []

            for dicom_path in image_paths:
                result_image = convert_dicom_to_png(
                    series_id=id,
                    series_path=series_path,
                    dicom_path=dicom_path,
                )

                if result_image is not None:
                    results.append(result_image["rawMetadata"])
                    processed_images.append(result_image)

            if not results:
                continue

            series_metadata = aggregate_metadata(results)

            orientation = series_metadata.get("Image Orientation (Patient)")
            description = series_metadata.get("Series Description")

            processed_series.append(
                {
                    "id": id,
                    "studyId": study_id,
                    "seriesNumber": series_metadata.get("Series Number"),
                    "modality": series_metadata.get("Modality"),
                    "protocol": (
                        get_protocol_name(description) if description else None
                    ),
                    "orientation": (
                        get_orientation.get_slice_orientation(orientation)
                        if orientation
                        else (
                            get_orientation.get_slice_orientation_from_series_description(
                                description
                            )
                            if description
                            else None
                        )
                    ),
                    "imagesCount": len(image_paths),
                    "rawMetadata": series_metadata,
                    "path": str(series_path),
                    "status": Status.COMPLETED,
                    "description": description,
                }
            )

        return processed_series, processed_images

    except Exception as e:
        raise RuntimeError(f"Ошибка при обработке серии: {e}") from e
