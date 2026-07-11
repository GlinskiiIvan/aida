import sys
import os
import pydicom
from PIL import Image
import numpy as np
import cv2
import uuid

from uuid6 import uuid7

from pathlib import Path

from .get_attrs import get_attrs


def convert_dicom_to_png(
    series_id: uuid.UUID,
    series_path: Path,
    dicom_path: str,
    apply_clahe: bool = True,
    apply_laplacian: bool = True,
):
    try:
        id = uuid7()

        if not os.path.exists(dicom_path):
            print(f"File not found: {dicom_path}", file=sys.stderr)
            return None

        try:
            ds = pydicom.dcmread(dicom_path, force=True)
        except Exception as e:
            print(f"Invalid DICOM: {dicom_path} {str(e)}", file=sys.stderr)
            return None

        if not hasattr(ds, "PixelData"):
            print(f"Skip (no PixelData): {dicom_path}", file=sys.stderr)
            return None

        image_data = ds.pixel_array

        image_data = (
            (image_data - np.min(image_data))
            / (np.max(image_data) - np.min(image_data))
            * 255
        )
        image_data = image_data.astype(np.uint8)  # Конвертируем в 8-битный формат

        if apply_clahe:
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            image_data = clahe.apply(image_data)

        if apply_laplacian:
            laplacian = cv2.Laplacian(image_data, cv2.CV_64F)
            laplacian_abs = cv2.convertScaleAbs(laplacian)
            image_data = cv2.addWeighted(image_data, 1.0, laplacian_abs, 0.5, 0)

        img = Image.fromarray(image_data)

        os.makedirs(series_path, exist_ok=True)

        filename = f"{os.path.splitext(os.path.basename(dicom_path))[0]}.png"
        output_path = os.path.join(series_path, filename)

        img.save(output_path)

        metadata = get_attrs(dicom_path)

        return {
            "id": id,
            "seriesId": series_id,
            "imageName": filename,
            "imagePath": output_path,
            "instanceNumber": metadata["Instance Number"],
            "rawMetadata": metadata,
        }
    except Exception as e:
        print(str(e))
        return None
