import os
import tempfile

from fastapi import APIRouter, UploadFile, File, HTTPException
from pypdf import PdfReader

from utils.chunking import chunk_text
from services.rag_service import embed_chunks
from services.vector_db import is_vector_store_enabled, store_vectors

router = APIRouter()


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Write to a secure temp file — never use user-supplied filename directly
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        try:
            reader = PdfReader(tmp_path)
        except Exception:
            raise HTTPException(status_code=422, detail="Failed to parse PDF.")

        text_parts = []
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:  # guard against None on image-only pages
                text_parts.append(page_text)

        text = "\n".join(text_parts).strip()
        if not text:
            raise HTTPException(status_code=422, detail="No extractable text found in PDF.")

        chunks = chunk_text(text)
        embeddings = embed_chunks(chunks)
        store_vectors(embeddings, doc_name=file.filename)

        indexed = is_vector_store_enabled()
        message = (
            "PDF processed and indexed successfully."
            if indexed
            else "PDF processed successfully (indexing disabled)."
        )

        return {
            "message": message,
            "filename": file.filename,
            "chunks": len(chunks),
            "indexed": indexed,
        }

    finally:
        # Always clean up the temp file
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)
