from dotenv import load_dotenv
import os

print("📂 Current Directory:", os.getcwd())  # <--- DEBUG

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("🔑 API Key Loaded:", GEMINI_API_KEY)  # <--- DEBUG

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent"

headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": GEMINI_API_KEY
}

async def get_caveman_law_explanation(prompt: str) -> str:
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(GEMINI_API_URL, headers=headers, json=payload)
            response.raise_for_status()

            result_json = response.json()
            print("🔍 Gemini Response:", result_json)

            return result_json['candidates'][0]['content']['parts'][0]['text']

    except Exception as e:
        print("🚨 Error talking to Gemini:", e)
        raise

print("🔑 API KEY:", GEMINI_API_KEY)
