from src.core.enums.protocol import Protocol


def get_protocol_name(series_description: str):
    if "t1" in series_description:
        return Protocol.T1
    elif "t2" in series_description:
        return Protocol.T2
    elif "pd" in series_description:
        return Protocol.PD
    else:
        return None
