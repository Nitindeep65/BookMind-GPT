from dotenv import load_dotenv
load_dotenv()  # loads .env into os.environ before any service imports

import os

from fastapi import FastAPI
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from controllers.uploadController import router as upload_router
from middleware.session_manager import (
    cookie_samesite,
    session_cookie_name,
    should_use_secure_cookie,
    touch_or_create_session_id,
)
from routes.chat import router as chat_router
from routes.session import router as session_router
from services.vector_db import delete_vectors_by_session

app = FastAPI(title="BookMind-GPT RAG API")


def _get_cors_origins() -> list[str]:
    raw = os.environ.get(
        "BACKEND_CORS_ORIGINS",
        "http://localhost:5173,http://localhost:5174,http://localhost:3000",
    )
    origins: list[str] = []
    for part in raw.split(","):
        origin = part.strip().strip("\"'").rstrip("/")
        if origin:
            origins.append(origin)
    return origins


_API_KEY = os.environ.get("BACKEND_API_KEY")
_CORS_ORIGIN_REGEX = os.environ.get("BACKEND_CORS_ORIGIN_REGEX", "").strip() or None

app.add_middleware(
    CORSMiddleware,
    allow_origins=_get_cors_origins(),
    allow_origin_regex=_CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def require_api_key(request: Request, call_next):
    # Keep auth optional: only enforced when BACKEND_API_KEY is configured.
    if _API_KEY and request.url.path.startswith("/api/"):
        provided = request.headers.get("x-api-key")
        if provided != _API_KEY:
            return JSONResponse(status_code=401, content={"detail": "Invalid API key."})

    return await call_next(request)


@app.middleware("http")
async def ensure_guest_session(request: Request, call_next):
    raw_cookie = request.cookies.get(session_cookie_name())
    session_id, is_new_session, expired_session_ids = touch_or_create_session_id(raw_cookie)

    request.state.session_id = session_id

    for expired_session_id in expired_session_ids:
        delete_vectors_by_session(expired_session_id)

    response = await call_next(request)

    # Refresh cookie when a new/invalid/expired session was replaced.
    if is_new_session or raw_cookie != session_id:
        secure_cookie = should_use_secure_cookie(request.url.scheme)
        response.set_cookie(
            key=session_cookie_name(),
            value=session_id,
            httponly=True,
            secure=secure_cookie,
            samesite=cookie_samesite(secure_cookie),
            path="/",
        )

    return response

app.include_router(upload_router, prefix="/api", tags=["Upload"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])
app.include_router(session_router, prefix="/api", tags=["Session"])


@app.get("/")
def home():
    return {"message": "RAG backend running"}


@app.get("/healthz")
def healthz():
    return {"status": "ok"}