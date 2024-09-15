from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
import io
import subprocess
import os
import tempfile

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {"origins": "http://localhost:5173", "supports_credentials": True}
    },
)


@app.route("/api/transcribe", methods=["POST"])
def transcribe():
    if "video" not in request.files:
        return jsonify({"error": "No video file uploaded"}), 400

    video_file = request.files["video"]
    video = io.BytesIO(video_file.read())

    try:
        url = "https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run"
        response = requests.post(
            url, files={"video": ("input.webm", video, "video/webm")}
        )
        response.raise_for_status()
        transcribed_text = response.text
        return jsonify({"transcription": transcribed_text})
    except requests.exceptions.RequestException as e:
        print(f"Error calling Symphonic Labs API: {e}")
        return jsonify({"error": "Failed to transcribe video"}), 500


@app.route("/api/convert-to-mp4", methods=["POST"])
def convert_to_mp4():
    if "video" not in request.files:
        return "No video file", 400

    video = request.files["video"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_input:
        video.save(temp_input)
        temp_input_path = temp_input.name

    temp_output_path = temp_input_path.replace(".webm", ".mp4")

    try:
        subprocess.run(
            [
                "ffmpeg",
                "-i",
                temp_input_path,
                "-c:v",
                "libx264",
                "-preset",
                "fast",
                temp_output_path,
            ],
            check=True,
        )

        return send_file(
            temp_output_path, as_attachment=True, download_name="converted_video.mp4"
        )
    except subprocess.CalledProcessError as e:
        return f"Conversion failed: {str(e)}", 500
    finally:
        os.unlink(temp_input_path)
        if os.path.exists(temp_output_path):
            os.unlink(temp_output_path)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
