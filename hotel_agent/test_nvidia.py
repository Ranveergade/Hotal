
import os
from pathlib import Path

from dotenv import load_dotenv
from openai import OpenAI

# Load the .env file from this project's root directory.
load_dotenv(Path(__file__).resolve().parent / ".env")

api_key = os.getenv("NVIDIA_API_KEY")

if not api_key:
    raise RuntimeError(
        "NVIDIA_API_KEY not found. Check your project's .env file."
    )

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=api_key,
    timeout=45.0,
)

try:
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[
            {
                "role": "user",
                "content": "Reply with exactly: NVIDIA connection successful",
            }
        ],
        max_tokens=100,
        temperature=0.2,
    )

    print("NVIDIA response:", response.choices[0].message.content)

except Exception as exc:
    print("NVIDIA request failed:", type(exc).__name__, str(exc))
