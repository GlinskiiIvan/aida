import asyncio
import zipfile
from pathlib import Path


async def extract_archive(study_path: Path, archive_path: Path) -> str:
    output_dir = Path(study_path) / "original"
    output_dir.mkdir(parents=True, exist_ok=True)

    archive = Path(archive_path)

    if not archive.exists():
        raise FileNotFoundError(f"Архив не найден: {archive}")

    def _extract():
        with zipfile.ZipFile(archive, "r") as zf:
            zf.extractall(output_dir)

        archive.unlink()

    try:
        await asyncio.to_thread(_extract)
        return str(output_dir)

    except Exception as e:
        if archive.exists():
            archive.unlink()

        raise RuntimeError(f"Ошибка при распаковке архива: {e}") from e
