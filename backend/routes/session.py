from fastapi import APIRouter, Request, Response

from middleware.session_manager import (
	invalidate_session,
	session_cookie_name,
	session_ttl_seconds,
)
from services.vector_db import delete_vectors_by_session

router = APIRouter()


@router.get("/session")
async def get_session(request: Request):
	session_id = getattr(request.state, "session_id", None)
	return {
		"session_id": session_id,
		"ttl_seconds": session_ttl_seconds(),
	}


@router.delete("/session")
async def end_session(request: Request, response: Response):
	session_id = getattr(request.state, "session_id", None)

	invalidate_session(session_id)
	delete_vectors_by_session(session_id)

	response.delete_cookie(
		key=session_cookie_name(),
		path="/",
	)
	return {"message": "Session ended."}
