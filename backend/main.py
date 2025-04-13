from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from gemini_client import get_caveman_law_explanation
from prompts import build_caveman_prompt
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class LawRequest(BaseModel):
    location: str

@app.post("/get-laws")
async def get_laws(request: LawRequest):
    try:
        prompt = build_caveman_prompt(request.location)
        result = await get_caveman_law_explanation(prompt)
        return {"location": request.location, "explanation": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))