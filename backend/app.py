# import os
# import tempfile

# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from faster_whisper import WhisperModel


# app = Flask(__name__)

# CORS(app)


# # ----------------------------------------
# # Maximum upload size
# # ----------------------------------------

# app.config["MAX_CONTENT_LENGTH"] = 500 * 1024 * 1024


# # ----------------------------------------
# # Supported audio formats
# # ----------------------------------------

# ALLOWED_EXTENSIONS = {
#     ".mp3",
#     ".wav",
#     ".m4a",
#     ".flac",
#     ".ogg",
#     ".webm",
#     ".mp4",
#     ".mpeg",
#     ".mpga",
#     ".aac",
#     ".opus",
# }


# # ----------------------------------------
# # Whisper model
# # ----------------------------------------

# MODEL_SIZE = "base"

# model = None


# def get_model():

#     global model

#     if model is None:

#         print(f"Loading Whisper model: {MODEL_SIZE}")

#         model = WhisperModel(
#             MODEL_SIZE,
#             device="cpu",
#             compute_type="int8",
#         )

#         print("Whisper model is ready.")

#     return model


# # ----------------------------------------
# # Convert seconds → SRT timestamp
# # ----------------------------------------

# def format_srt_time(seconds):

#     total_ms = max(
#         0,
#         round(float(seconds) * 1000)
#     )

#     hours = total_ms // 3_600_000

#     total_ms %= 3_600_000

#     minutes = total_ms // 60_000

#     total_ms %= 60_000

#     secs = total_ms // 1_000

#     ms = total_ms % 1_000

#     return (
#         f"{hours:02d}:"
#         f"{minutes:02d}:"
#         f"{secs:02d},"
#         f"{ms:03d}"
#     )


# # ----------------------------------------
# # Create SRT file content
# # ----------------------------------------

# def create_srt(segments):

#     blocks = []

#     for index, segment in enumerate(
#         segments,
#         start=1
#     ):

#         blocks.append(
#             f"{index}\n"
#             f"{format_srt_time(segment['start'])} --> "
#             f"{format_srt_time(segment['end'])}\n"
#             f"{segment['text']}\n"
#         )

#     return "\n".join(blocks)


# # ----------------------------------------
# # Backend health check
# # ----------------------------------------

# @app.get("/")
# def home():

#     return jsonify({
#         "success": True,
#         "message": "ClearVoice transcription server is running."
#     })


# # ----------------------------------------
# # Audio transcription
# # ----------------------------------------

# @app.post("/api/transcribe")
# def transcribe():

#     temp_path = None

#     try:

#         # --------------------------------
#         # Check uploaded file
#         # --------------------------------

#         if "file" not in request.files:

#             return jsonify({
#                 "success": False,
#                 "error": "No audio file was uploaded."
#             }), 400


#         uploaded_file = request.files["file"]


#         if not uploaded_file.filename:

#             return jsonify({
#                 "success": False,
#                 "error": "No audio file was selected."
#             }), 400


#         # --------------------------------
#         # Check extension
#         # --------------------------------

#         extension = os.path.splitext(
#             uploaded_file.filename
#         )[1].lower()


#         if extension not in ALLOWED_EXTENSIONS:

#             return jsonify({
#                 "success": False,
#                 "error": (
#                     "Unsupported file type. "
#                     "Use MP3, WAV, M4A, FLAC, OGG, "
#                     "WebM, AAC or OPUS."
#                 )
#             }), 400


#         # --------------------------------
#         # Save temporary audio file
#         # --------------------------------

#         with tempfile.NamedTemporaryFile(
#             delete=False,
#             suffix=extension
#         ) as temp_file:

#             uploaded_file.save(
#                 temp_file.name
#             )

#             temp_path = temp_file.name


#         # --------------------------------
#         # Requested language
#         # --------------------------------

#         requested_language = (
#             request.form.get("language")
#             or None
#         )


#         # --------------------------------
#         # Load Whisper
#         # --------------------------------

#         whisper = get_model()


#         # --------------------------------
#         # Transcribe
#         # --------------------------------

#         segments_generator, info = whisper.transcribe(

#             temp_path,

#             beam_size=5,

#             language=requested_language,

#             vad_filter=True,
#         )


#         # --------------------------------
#         # Build subtitle segments
#         # --------------------------------

#         segments = []


#         for segment in segments_generator:

#             text = segment.text.strip()


#             if not text:
#                 continue


#             segments.append({

#                 "start": round(
#                     float(segment.start),
#                     3
#                 ),

#                 "end": round(
#                     float(segment.end),
#                     3
#                 ),

#                 "text": text,

#                 "avg_logprob": round(
#                     float(segment.avg_logprob),
#                     4
#                 ),

#             })


#         # --------------------------------
#         # Full transcript
#         # --------------------------------

#         transcript = " ".join(
#             item["text"]
#             for item in segments
#         )


#         # --------------------------------
#         # Return result
#         # --------------------------------

#         return jsonify({

#             "success": True,

#             "filename": uploaded_file.filename,

#             "detected_language": info.language,

#             "language_probability": round(
#                 float(info.language_probability),
#                 4
#             ),

#             "transcript": transcript,

#             "segments": segments,

#             "srt": create_srt(segments),

#         })


#     except Exception as error:

#         print(
#             "Transcription error:",
#             repr(error)
#         )


#         return jsonify({

#             "success": False,

#             "error": str(error),

#         }), 500


#     finally:

#         # --------------------------------
#         # Remove temporary file
#         # --------------------------------

#         if temp_path and os.path.exists(
#             temp_path
#         ):

#             try:

#                 os.remove(temp_path)

#             except OSError:

#                 pass


# # ----------------------------------------
# # Start Flask
# # ----------------------------------------

# if __name__ == "__main__":

#     app.run(

#         host="127.0.0.1",

#         port=5000,

#         debug=True

#     )
import os
import tempfile

from flask import Flask, jsonify, request
from flask_cors import CORS
from faster_whisper import WhisperModel

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = {
    ".mp3", ".wav", ".m4a", ".flac", ".ogg", ".webm", ".mp4", ".mpeg", ".mpga", ".aac", ".opus"
}

# Free local speech-to-text model.
# "base" is a good starting point for a normal laptop CPU.
MODEL_SIZE = "base"
model = None


def get_model():
    global model
    if model is None:
        print(f"Loading Whisper model: {MODEL_SIZE}")
        model = WhisperModel(
            MODEL_SIZE,
            device="cpu",
            compute_type="int8",
        )
        print("Whisper model is ready.")
    return model


def format_srt_time(seconds):
    total_ms = max(0, round(float(seconds) * 1000))
    hours = total_ms // 3_600_000
    total_ms %= 3_600_000
    minutes = total_ms // 60_000
    total_ms %= 60_000
    secs = total_ms // 1_000
    ms = total_ms % 1_000
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{ms:03d}"


def create_srt(segments):
    blocks = []
    for index, segment in enumerate(segments, start=1):
        blocks.append(
            f"{index}\n"
            f"{format_srt_time(segment['start'])} --> {format_srt_time(segment['end'])}\n"
            f"{segment['text']}\n"
        )
    return "\n".join(blocks)


@app.get("/")
def home():
    return jsonify({
        "success": True,
        "message": "ClearVoice transcription server is running."
    })


@app.post("/api/transcribe")
def transcribe():
    temp_path = None

    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No audio file was uploaded."}), 400

        uploaded_file = request.files["file"]

        if not uploaded_file.filename:
            return jsonify({"success": False, "error": "No audio file was selected."}), 400

        extension = os.path.splitext(uploaded_file.filename)[1].lower()
        if extension not in ALLOWED_EXTENSIONS:
            return jsonify({
                "success": False,
                "error": "Unsupported file type. Use MP3, WAV, M4A, FLAC, OGG, WebM, AAC, OPUS or a supported video/audio format."
            }), 400

        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
            uploaded_file.save(temp_file.name)
            temp_path = temp_file.name

        requested_language = request.form.get("language") or None
        whisper = get_model()

        segments_generator, info = whisper.transcribe(
            temp_path,
            beam_size=5,
            language=requested_language,
            vad_filter=True,
        )

        segments = []
        for segment in segments_generator:
            text = segment.text.strip()
            if not text:
                continue

            segments.append({
                "start": round(float(segment.start), 3),
                "end": round(float(segment.end), 3),
                "text": text,
                "avg_logprob": round(float(segment.avg_logprob), 4),
            })

        transcript = " ".join(item["text"] for item in segments)

        return jsonify({
            "success": True,
            "filename": uploaded_file.filename,
            "detected_language": info.language,
            "language_probability": round(float(info.language_probability), 4),
            "transcript": transcript,
            "segments": segments,
            "srt": create_srt(segments),
        })

    except Exception as error:
        print("Transcription error:", repr(error))
        return jsonify({
            "success": False,
            "error": str(error),
        }), 500

    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except OSError:
                pass


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
