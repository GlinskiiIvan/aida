import sys
import time
import uuid
import os
import contextlib
import io
from ultralytics import YOLO

from src.core.config import MODELS_DIR

from src.modules.inference import schema

from src.core.enums.status import Status
from src.core.enums.result_class import ResultClass


def predict_image(run_id: int, model_name: str, image: schema.PredictionImageDTO):
    start_time = time.time()

    try:
        if not os.path.exists(image.path):
            raise Exception(f"File not found: {image.path}")

        modelPath = os.path.join(MODELS_DIR, "yolo", "bbox", "8x.pt")

        f = io.StringIO()

        with contextlib.redirect_stdout(f):
            model = YOLO(modelPath)
            results = model(image.path, verbose=False)

        result = results[0]
        boxes = result.boxes

        output = []

        if len(boxes) > 0:
            for i in range(len(boxes)):
                cls_id = int(boxes.cls[i])
                class_name = model.names[cls_id]
                confidence = float(boxes.conf[i])
                bbox = boxes.xyxy[i].tolist()

                output.append(
                    {
                        "class": class_name,
                        "confidence": round(confidence, 4),
                        "bbox": bbox,
                    }
                )

        execution_time = int((time.time() - start_time) * 1000)

        is_tear = any(r["class"] == ResultClass.Tear for r in output)

        result_class = (
            None if not output else ResultClass.Tear if is_tear else ResultClass.Normal
        )

        min_confidence = min((r["confidence"] for r in output), default=0)
        max_confidence = max((r["confidence"] for r in output), default=0)

        return {
            "runId": run_id,
            "imageId": image.id,
            "status": Status.COMPLETED,
            "rawOutput": output,
            "resultClass": result_class,
            "minConfidence": min_confidence,
            "maxConfidence": max_confidence,
            "executionTime": execution_time,
        }
    except Exception as e:
        print(str(e))


def predict(
    run_id: int,
    model_name: str,
    images: list[schema.PredictionImageDTO],
):
    result = []
    for index, image in enumerate(images, start=1):
        output = predict_image(
            run_id=run_id,
            model_name=model_name,
            image=image,
        )
        result.append(output)
        print(f"Выполнено предсказание: {index}/{len(images)}")
    return result
