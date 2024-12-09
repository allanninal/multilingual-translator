from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import multiprocessing
from typing import Dict, Optional
from functools import lru_cache
import logging
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from dataclasses import dataclass

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
@dataclass
class Config:
    """Configuration class for default settings."""
    DEFAULT_SOURCE_LANG: str = "en"  # Default source language
    DEFAULT_TARGET_LANG: str = "es"  # Default target language
    MAX_TEXT_LENGTH: int = 1000      # Maximum allowed text length for translation
    MODEL_BASE_PATH: str = "Helsinki-NLP/opus-mt"  # Base path for translation models

config = Config()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Initialize rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,  # Function to determine the unique key for rate limiting
    default_limits=["100 per day", "10 per minute"]  # Default rate limits
)

# Cache for translation models
@lru_cache(maxsize=5)
def get_translator(source_lang: str, target_lang: str):
    """
    Cache and return translation model for a given language pair.
    
    Args:
        source_lang (str): Source language code.
        target_lang (str): Target language code.
    
    Returns:
        A translation pipeline object.
    
    Raises:
        ValueError: If the model cannot be loaded for the given language pair.
    """
    try:
        model_name = f"{config.MODEL_BASE_PATH}-{source_lang}-{target_lang}"
        logger.info(f"Loading translation model: {model_name}")
        return pipeline("translation", model=model_name)
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        raise ValueError(f"Unsupported language pair: {source_lang}-{target_lang}")

def validate_input(text: str, source_language: str, target_language: str) -> Optional[Dict]:
    """
    Validate input parameters for the translation request.
    
    Args:
        text (str): Text to be translated.
        source_language (str): Source language code.
        target_language (str): Target language code.
    
    Returns:
        Optional[Dict]: Error message and status code if validation fails, otherwise None.
    """
    if not text:
        return {"error": "No text provided"}, 400
    if len(text) > config.MAX_TEXT_LENGTH:
        return {"error": f"Text exceeds maximum length of {config.MAX_TEXT_LENGTH}"}, 400
    if source_language == target_language:
        return {"error": "Source and target languages must be different"}, 400
    return None

@app.route('/translate', methods=['POST'])
@limiter.limit("10 per minute")  # Apply rate limiting to this endpoint
def translate():
    """
    Handle translation requests.
    
    Expects a JSON payload with 'text', 'source_language', and 'target_language'.
    
    Returns:
        JSON response with translated text or error message.
    """
    try:
        request_data = request.json
        input_text = request_data.get("text", "")
        source_language = request_data.get("source_language", config.DEFAULT_SOURCE_LANG)
        target_language = request_data.get("target_language", config.DEFAULT_TARGET_LANG)

        # Validate input
        validation_error = validate_input(input_text, source_language, target_language)
        if validation_error:
            return jsonify(validation_error[0]), validation_error[1]

        # Get cached translator or create new one
        translator_pipeline = get_translator(source_language, target_language)

        # Perform translation
        translation_result = translator_pipeline(input_text, max_length=400)
        translated_text = translation_result[0]['translation_text']

        logger.info(f"Successfully translated text from {source_language} to {target_language}")
        return jsonify({
            "translated_text": translated_text,
            "source_language": source_language,
            "target_language": target_language
        })

    except ValueError as validation_exception:
        logger.error(f"Validation error: {str(validation_exception)}")
        return jsonify({"error": str(validation_exception)}), 400
    except Exception as general_exception:
        logger.error(f"Translation error: {str(general_exception)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    multiprocessing.freeze_support()  # Support for Windows multiprocessing
    app.run(debug=True)  # Run the Flask app in debug mode
