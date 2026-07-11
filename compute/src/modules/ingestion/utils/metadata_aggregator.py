from collections import Counter, defaultdict
from typing import Any


def normalize_value(value: Any) -> Any:
    if value is None:
        return None

    if isinstance(value, list):
        return tuple(value)

    if isinstance(value, tuple):
        return value

    try:
        hash(value)
        return value
    except TypeError:
        return str(value)


def aggregate_metadata(metadata_list: list[dict[str, Any]]) -> dict[str, Any]:
    counters: dict[str, Counter] = defaultdict(Counter)
    originals: dict[str, dict[Any, Any]] = defaultdict(dict)

    for metadata in metadata_list:
        for key, value in metadata.items():
            if value is None:
                continue

            normalized = normalize_value(value)

            counters[key][normalized] += 1
            originals[key][normalized] = value

    result = {}

    for key, counter in counters.items():
        normalized_value, _ = counter.most_common(1)[0]
        result[key] = originals[key][normalized_value]

    return result
