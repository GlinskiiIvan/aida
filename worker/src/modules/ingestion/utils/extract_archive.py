import asyncio
import zipfile
from pathlib import Path


async def extract_archive(study_path: Path, archive_path: Path) -> Path:
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

        items = list(output_dir.iterdir())

        if len(items) == 1 and items[0].is_dir():
            root = items[0]

            for item in root.iterdir():
                item.rename(output_dir / item.name)

            root.rmdir()

        return output_dir

    except Exception as e:
        if archive.exists():
            archive.unlink()

        raise RuntimeError(f"Ошибка при распаковке архива: {e}") from e
