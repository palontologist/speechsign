from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
import os

router = APIRouter()

# Environment variable for the target app URL
# Example: https://your-speech-to-sign-app.vercel.app/api/omi/interpret
SIGN_APP_URL = os.getenv("SIGN_APP_URL", "http://localhost:3000/api/omi/interpret")

class OmiPayload(BaseModel):
    text: str
    user_id: str = "unknown"
    session_id: str = "unknown"

@router.post("/interpret")
async def interpret_speech(payload: OmiPayload):
    """
    Endpoint called by Omi to forward real-time speech transcripts 
    to the Speech-to-Sign interpretation service.
    """
    try:
        # Forward the transcript to the Next.js backend
        response = requests.post(
            SIGN_APP_URL, 
            json={"text": payload.text, "user_id": payload.user_id},
            timeout=5
        )
        response.raise_for_status()
        
        return {
            "status": "success",
            "message": "Transcript forwarded for interpretation",
            "app_response": response.json()
        }
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"External app error: {str(e)}")

# For standalone testing
if __name__ == "__main__":
    import uvicorn
    from fastapi import FastAPI
    app = FastAPI()
    app.include_router(router)
    uvicorn.run(app, host="0.0.0.0", port=8000)
