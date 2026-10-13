
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

app = FastAPI(
    title="HomeDecor AI API",
    description="Backend API for AI-powered room redesign",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "homedecor-api",
    }


@app.post("/api/redesign", tags=["Room Redesign"])
async def redesign_test(
    image: UploadFile = File(...),
    prompt: str = Form(...),
):
    # Validate the prompt.
    prompt = prompt.strip()

    if not prompt:
        raise HTTPException(
            status_code=400,
            detail="Prompt must not be empty.",
        )

    # Validate the uploaded image's content type.
    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if image.content_type not in allowed_types:
        raise HTTPException(
            status_code=415,
            detail="Unsupported image type. Upload JPEG, PNG, or WebP.",
        )

    # Read and retain the image while enforcing the 10 MB limit.
    max_size = 10 * 1024 * 1024
    total_size = 0
    image_chunks = []

    try:
        while True:
            chunk = await image.read(1024 * 1024)

            if not chunk:
                break

            total_size += len(chunk)

            if total_size > max_size:
                raise HTTPException(
                    status_code=413,
                    detail="Image must not exceed 10 MB.",
                )

            image_chunks.append(chunk)
    finally:
        await image.close()

    if total_size == 0:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty.",
        )

    # Test mode: return the original image without AI inference.
    image_bytes = b"".join(image_chunks)

    return Response(
        content=image_bytes,
        media_type=image.content_type,
        headers={
            "Content-Disposition": 'inline; filename="test-response"',
            "X-Response-Mode": "test",
        },
    )
