import os
import threading
import time
import uuid
from typing import Tuple


_lock = threading.Lock()
_session_last_seen: dict[str, float] = {}


def _parse_int(name: str, default: int) -> int:
    raw = os.environ.get(name)
    if not raw:
        return default
    try:
        value = int(raw)
        return value if value > 0 else default
    except ValueError:
        return default


def _session_ttl_seconds() -> int:
    # Default: 30 minutes of inactivity.
    return _parse_int("GUEST_SESSION_TTL_SECONDS", 1800)


def session_cookie_name() -> str:
    return os.environ.get("GUEST_SESSION_COOKIE_NAME", "bookmind_guest_sid")


def is_valid_session_id(value: str | None) -> bool:
    if not value or len(value) > 128:
        return False
    try:
        uuid.UUID(value)
        return True
    except ValueError:
        return False


def _new_session_id() -> str:
    return str(uuid.uuid4())


def should_use_secure_cookie(request_scheme: str) -> bool:
    mode = os.environ.get("GUEST_SESSION_COOKIE_SECURE", "auto").strip().lower()
    if mode == "true":
        return True
    if mode == "false":
        return False
    return request_scheme == "https"


def cookie_samesite(secure_cookie: bool) -> str:
    configured = os.environ.get("GUEST_SESSION_COOKIE_SAMESITE", "").strip().lower()
    if configured in {"lax", "strict", "none"}:
        return configured
    return "none" if secure_cookie else "lax"


def touch_or_create_session_id(existing_session_id: str | None) -> Tuple[str, bool, list[str]]:
    """
    Returns: (active_session_id, is_new_session, expired_session_ids)
    """
    now = time.time()
    ttl = _session_ttl_seconds()
    cutoff = now - ttl

    expired_session_ids: list[str] = []
    with _lock:
        # Evict stale sessions first.
        for sid, last_seen in list(_session_last_seen.items()):
            if last_seen < cutoff:
                expired_session_ids.append(sid)
                del _session_last_seen[sid]

        candidate = existing_session_id if is_valid_session_id(existing_session_id) else None
        if candidate:
            _session_last_seen[candidate] = now
            return candidate, False, expired_session_ids

        session_id = _new_session_id()
        _session_last_seen[session_id] = now
        return session_id, True, expired_session_ids


def invalidate_session(session_id: str | None) -> None:
    if not session_id:
        return
    with _lock:
        _session_last_seen.pop(session_id, None)


def session_ttl_seconds() -> int:
    return _session_ttl_seconds()
