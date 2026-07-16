import base64
import json
from flask import Blueprint, request, jsonify
from config import ANTHROPIC_API_KEY, VISION_MODEL, MAX_UPLOAD_MB, ALLOWED_IMAGE_TYPES

detect_bp = Blueprint("detect", __name__)

DETECTION_PROMPT = (
    "You are a food recognition assistant. Look at the image and identify the single "
    "most likely food or main ingredient shown. Respond ONLY with strict JSON, no "
    "markdown, no extra text, in this exact shape: "
    '{"food_name": "<lowercase common ingredient or dish name>", "confidence": "high|medium|low"}'
)


import random


MOCK_FOODS = [
    "egg",
    "chicken",
    "tofu",
    "spinach",
    "beef",
    "salmon",
    "tempeh",
]


def _mock_detection():
    food = random.choice(MOCK_FOODS)

    return {
        "food_name": food,
        "confidence": random.choice(
            ["high", "medium", "low"]
        ),
        "mocked": True
    }

@detect_bp.route("/api/detect", methods=["POST"])
def detect_food():
    if "image" not in request.files:
        return jsonify({"error": "Field 'image' (multipart file) is required"}), 400

    file = request.files["image"]

    if file.mimetype not in ALLOWED_IMAGE_TYPES:
        return jsonify({"error": f"Unsupported image type: {file.mimetype}"}), 400

    file.seek(0, 2)
    size_mb = file.tell() / (1024 * 1024)
    file.seek(0)
    if size_mb > MAX_UPLOAD_MB:
        return jsonify({"error": f"Image exceeds {MAX_UPLOAD_MB}MB limit"}), 400

    image_bytes = file.read()

    if not ANTHROPIC_API_KEY:
        return jsonify(_mock_detection()), 200

    try:
        import anthropic

        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
        b64_image = base64.b64encode(image_bytes).decode("utf-8")

        response = client.messages.create(
            model=VISION_MODEL,
            max_tokens=200,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": file.mimetype,
                                "data": b64_image,
                            },
                        },
                        {"type": "text", "text": DETECTION_PROMPT},
                    ],
                }
            ],
        )

        raw_text = "".join(
            block.text for block in response.content if block.type == "text"
        ).strip()
        parsed = json.loads(raw_text)
        return jsonify(parsed), 200

    except json.JSONDecodeError:
        return jsonify({"error": "Model returned a non JSON response", "raw": raw_text}), 502
    except Exception as exc:
        return jsonify({"error": f"Detection failed: {str(exc)}"}), 502
