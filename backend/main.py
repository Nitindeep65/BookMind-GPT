from dotenv import load_dotenv
load_dotenv()  # loads .env into os.environ before any service imports

import os

from fastapi import FastAPI
from fastapi import Request
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from controllers.uploadController import router as upload_router
from routes.chat import router as chat_router
from routes.session import router as session_router

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

app.include_router(upload_router, prefix="/api", tags=["Upload"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])
app.include_router(session_router, prefix="/api", tags=["Session"])


@app.get("/")
def home():
    return {"message": "RAG backend running"}


@app.get("/healthz")
def healthz():
    return {"status": "ok"}