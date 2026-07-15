import sys
import math
import time
import uuid
import os
import contextlib
import io
from ultralytics import YOLO

from src.core.config import MODELS_DIR

from src.modules.inference import schema

from src.core.enums.status import Status
from src.core.enums.task import Task
from src.core.enums.result_class import ResultClass

from src.core.ws.publisher import publish_task


def predict_image(run_id: int, model_name: str, image: schema.PredictionImageDTO):
    start_time = time.time()

    try:
        if not os.path.exists(image.path):
            raise Exception(f"File not found: {image.path}")

        modelPath = os.path.join(MODELS_DIR, "det", model_name)

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


def predict_old(
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


def predict(
    task_id: str,
    run_id: int,
    model_name: str,
    images: list[schema.PredictionImageDTO],
):
    BATCH_SIZE = 16
    total_images = len(images)
    total_batches = math.ceil(total_images / BATCH_SIZE)

    model_path = os.path.join(MODELS_DIR, "yolo", "bbox", "8x.pt")
    model = YOLO(model_path)

    predictions = []

    for batch_start in range(0, total_images, BATCH_SIZE):
        batch = images[batch_start : batch_start + BATCH_SIZE]

        start_time = time.time()

        results = model(
            [img.path for img in batch],
            batch=BATCH_SIZE,
            verbose=False,
        )

        batch_time = int((time.time() - start_time) * 1000)

        for image, result in zip(batch, results):
            boxes = result.boxes

            raw_output = []

            for i in range(len(boxes)):
                cls_id = int(boxes.cls[i])

                raw_output.append(
                    {
                        "class": model.names[cls_id],
                        "confidence": round(float(boxes.conf[i]), 4),
                        "bbox": boxes.xyxy[i].tolist(),
                    }
                )

            is_tear = any(
                prediction["class"] == ResultClass.Tear for prediction in raw_output
            )

            result_class = (
                None
                if not raw_output
                else ResultClass.Tear
                if is_tear
                else ResultClass.Normal
            )

            predictions.append(
                {
                    "runId": run_id,
                    "imageId": image.id,
                    "status": Status.COMPLETED,
                    "rawOutput": raw_output,
                    "resultClass": result_class,
                    "minConfidence": min(
                        (prediction["confidence"] for prediction in raw_output),
                        default=0,
                    ),
                    "maxConfidence": max(
                        (prediction["confidence"] for prediction in raw_output),
                        default=0,
                    ),
                }
            )

        processed = min(batch_start + len(batch), total_images)
        current_batch = batch_start // BATCH_SIZE + 1

        print(
            f"[YOLO] Batch {batch_start // BATCH_SIZE + 1}: "
            f"{processed}/{total_images} images processed "
            f"({batch_time} ms)"
        )

        publish_task(
            task_id=task_id,
            message={
                "task_id": task_id,
                "task_type": Task.INFERENCE_STUDY,
                "status": Status.PROCESSING,
                "progress": {
                    "totalImages": total_images,
                    "processedImages": processed,
                    "batchSize": BATCH_SIZE,
                    "totalBatches": total_batches,
                    "currentBatch": current_batch,
                    "batchTime": batch_time,
                },
            },
        )

    return predictions
