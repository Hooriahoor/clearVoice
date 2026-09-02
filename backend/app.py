import os
import tempfile

from flask import Flask, jsonify, request
from flask_cors import CORS
from faster_whisper import WhisperModel
from deep_translator import GoogleTranslator


app = Flask(__name__)

# Allow React frontend to communicate with Flask
CORS(app)


# ==================================================
# AUDIO FORMATS
# ==================================================

ALLOWED_EXTENSIONS = {
    ".mp3",
    ".wav",
    ".m4a",
    ".flac",
    ".ogg",
    ".webm",
    ".mp4",
    ".mpeg",
    ".mpg",
    ".mpga",
    ".aac",
    ".opus",
}


# ==================================================
# WHISPER MODEL
# ==================================================

MODEL_SIZE = "base"

model = None


# ==================================================
# LANGUAGES
# ==================================================

TRANSLATION_LANGUAGES = {
    "Arabic": "ar",
    "Urdu": "ur",
    "Spanish": "es",
    "French": "fr",
}


# ==================================================
# LOAD WHISPER MODEL
# ==================================================

def get_model():
    """
    Load Whisper only when it is needed.
    """

    global model

    if model is None:

        print()
        print("======================================")
        print(f"Loading Whisper model: {MODEL_SIZE}")
        print("======================================")

        model = WhisperModel(
            MODEL_SIZE,
            device="cpu",
            compute_type="int8",
        )

        print("Whisper model is ready.")

    return model


# ==================================================
# SRT TIME FORMAT
# ==================================================

def format_srt_time(seconds):
    """
    Convert seconds into SRT timestamp format.

    Example:

    1.25
    becomes:

    00:00:01,250
    """

    total_ms = max(
        0,
        round(float(seconds) * 1000),
    )

    hours = total_ms // 3_600_000

    total_ms %= 3_600_000

    minutes = total_ms // 60_000

    total_ms %= 60_000

    secs = total_ms // 1_000

    milliseconds = total_ms % 1_000

    return (
        f"{hours:02d}:"
        f"{minutes:02d}:"
        f"{secs:02d},"
        f"{milliseconds:03d}"
    )


# ==================================================
# CREATE SRT
# ==================================================

def create_srt(segments):
    """
    Create an SRT subtitle string.
    """

    blocks = []

    for index, segment in enumerate(
        segments,
        start=1,
    ):

        block = (
            f"{index}\n"
            f"{format_srt_time(segment['start'])} --> "
            f"{format_srt_time(segment['end'])}\n"
            f"{segment['text']}\n"
        )

        blocks.append(block)

    return "\n".join(blocks)


# ==================================================
# TRANSLATE ONLY SELECTED LANGUAGE
# ==================================================

def translate_segments(
    segments,
    target_language,
):
    """
    Translate Whisper segments into ONLY
    the language selected by the user.

    Example:

        target_language = "Urdu"

    Only Urdu translation is performed.

    Arabic / Spanish / French are NOT translated.
    """

    target_code = TRANSLATION_LANGUAGES.get(
        target_language
    )

    if not target_code:

        raise ValueError(
            f"Unsupported target language: "
            f"{target_language}"
        )

    print()
    print("======================================")
    print(
        f"Translating ONLY into: "
        f"{target_language}"
    )
    print("======================================")

    translator = GoogleTranslator(
        source="auto",
        target=target_code,
    )

    translations = []

    total_segments = len(segments)

    for index, segment in enumerate(
        segments,
        start=1,
    ):

        source_text = segment["text"].strip()

        print(
            f"{target_language}: "
            f"{index}/{total_segments}"
        )

        try:

            if not source_text:

                translated = ""

            else:

                translated = translator.translate(
                    source_text
                )

            translations.append(
                translated or source_text
            )

        except Exception as error:

            print(
                f"Translation error "
                f"(segment {index}):",
                repr(error),
            )

            # If translation fails,
            # keep the original text.
            translations.append(
                source_text
            )

    print()
    print(
        f"{target_language} translation completed."
    )

    return translations


# ==================================================
# HOME / HEALTH CHECK
# ==================================================

@app.get("/")
def home():

    return jsonify({
        "success": True,
        "message": (
            "ClearVoice transcription "
            "server is running."
        ),
    })


# ==================================================
# TRANSCRIBE + TRANSLATE SELECTED LANGUAGE
# ==================================================

@app.post("/api/transcribe")
def transcribe():

    temp_path = None

    try:

        # ------------------------------------------
        # CHECK FILE
        # ------------------------------------------

        if "file" not in request.files:

            return jsonify({
                "success": False,
                "error": (
                    "No audio file was uploaded."
                ),
            }), 400

        uploaded_file = request.files["file"]

        if not uploaded_file.filename:

            return jsonify({
                "success": False,
                "error": (
                    "No audio file was selected."
                ),
            }), 400

        # ------------------------------------------
        # CHECK EXTENSION
        # ------------------------------------------

        extension = os.path.splitext(
            uploaded_file.filename
        )[1].lower()

        if extension not in ALLOWED_EXTENSIONS:

            return jsonify({
                "success": False,
                "error": (
                    "Unsupported file type. "
                    "Please use MP3, WAV, M4A, MPEG, "
                    "MPG, MPGA, FLAC, OGG, WebM, "
                    "AAC or OPUS."
                ),
            }), 400

        # ------------------------------------------
        # GET SELECTED LANGUAGE
        # ------------------------------------------

        target_language = (
            request.form.get(
                "target_language"
            )
            or "Arabic"
        )

        if target_language not in TRANSLATION_LANGUAGES:

            return jsonify({
                "success": False,
                "error": (
                    f"Unsupported target language: "
                    f"{target_language}"
                ),
            }), 400

        print()
        print("======================================")
        print("ClearVoice request")
        print("Filename:", uploaded_file.filename)
        print("Selected language:", target_language)
        print("======================================")

        # ------------------------------------------
        # SAVE TEMPORARY AUDIO
        # ------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension,
        ) as temp_file:

            uploaded_file.save(
                temp_file.name
            )

            temp_path = temp_file.name

        print(
            "Temporary audio saved:",
            temp_path,
        )

        # ------------------------------------------
        # LOAD WHISPER
        # ------------------------------------------

        whisper = get_model()

        # ------------------------------------------
        # TRANSCRIBE AUDIO
        #
        # language=None means Whisper internally
        # detects the spoken/source language.
        #
        # This is NOT shown as an option to the user.
        # ------------------------------------------

        print()
        print(
            "Transcribing audio..."
        )

        segments_generator, info = (
            whisper.transcribe(
                temp_path,
                beam_size=5,
                language=None,
                vad_filter=True,
            )
        )

        # ------------------------------------------
        # BUILD TIMESTAMPED SEGMENTS
        # ------------------------------------------

        segments = []

        for segment in segments_generator:

            text = segment.text.strip()

            if not text:
                continue

            segments.append({

                "start": round(
                    float(segment.start),
                    3,
                ),

                "end": round(
                    float(segment.end),
                    3,
                ),

                "text": text,

                "avg_logprob": round(
                    float(segment.avg_logprob),
                    4,
                ),
            })

        # ------------------------------------------
        # ORIGINAL TRANSCRIPT
        # ------------------------------------------

        transcript = " ".join(
            item["text"]
            for item in segments
        )

        print()
        print("======================================")
        print("Transcription completed!")
        print(
            "Source language detected internally:",
            info.language,
        )
        print(
            "Language probability:",
            round(
                float(
                    info.language_probability
                ),
                4,
            ),
        )
        print(
            "Subtitle lines:",
            len(segments),
        )
        print("======================================")

        # ------------------------------------------
        # TRANSLATE ONLY SELECTED LANGUAGE
        # ------------------------------------------

        translations = translate_segments(
            segments,
            target_language,
        )

        # ------------------------------------------
        # CREATE TRANSLATED SEGMENTS
        # ------------------------------------------

        translated_segments = []

        for index, segment in enumerate(
            segments
        ):

            translated_segments.append({

                "start": segment["start"],

                "end": segment["end"],

                "text": translations[index],
            })

        # ------------------------------------------
        # CREATE SRT
        # ------------------------------------------

        srt = create_srt(segments)

        translated_srt = create_srt(
            translated_segments
        )

        # ------------------------------------------
        # RESPONSE
        # ------------------------------------------

        return jsonify({

            "success": True,

            "filename": (
                uploaded_file.filename
            ),

            # Original transcript
            "transcript": transcript,

            # Original timestamped lines
            "segments": segments,

            # ONLY selected language translations
            "translations": translations,

            # Which language was generated
            "target_language": target_language,

            # Original SRT
            "srt": srt,

            # SRT ONLY for selected language
            "translated_srt": translated_srt,
        })

    except Exception as error:

        print()
        print("======================================")
        print(
            "TRANSCRIPTION / TRANSLATION ERROR"
        )
        print(
            repr(error)
        )
        print("======================================")

        return jsonify({

            "success": False,

            "error": str(error),

        }), 500

    finally:

        # ------------------------------------------
        # DELETE TEMPORARY AUDIO
        # ------------------------------------------

        if (
            temp_path
            and os.path.exists(temp_path)
        ):

            try:

                os.remove(temp_path)

            except OSError:

                pass


# ==================================================
# RUN SERVER
# ==================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )