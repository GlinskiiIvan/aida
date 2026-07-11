from src.core.enums.protocol import Protocol


def get_protocol_name(value: str):
    if "t1" in value:
        return Protocol.T1
    elif "t2" in value:
        return Protocol.T2
    elif "pd" in value:
        return Protocol.PD
    else:
        return None
