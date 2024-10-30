import os
import io
import tempfile
import subprocess
import requests
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # Import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(
    app,
    resources={
        r"/*": {"origins": "*", "supports_credentials": True}
    },
)
# CORS(app)  # Enable CORS for all routes!
 

# Define your Symphonic Labs API key here or load it from environment variables
# API_KEY = os.getenv("API_KEY")  # Ensure this is set in your environment


@app.route("/", methods=["GET"])
def root():
    return "Hello World"


@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    # Load the video file from the backend directory
    video_path = 'video.mp4'  # Make sure this file exists in the backend directory

    # 2. ask how to temporarily save recorded video, based on existing code. and use that here instead of hardcided video.mp4 in backend folder. try using requests.file again here? 

    # Check if the video file exists
    if not os.path.exists(video_path):
        print("Video file does not exist:", video_path)
        return jsonify({"error": "Video file not found"}), 404

    print("Using video file:", video_path)

    # Prepare the request to the transcription API
    try:
        with open(video_path, 'rb') as video_file:
            files = {
                'video': ('video.mp4', video_file),
                'api_key': (None, 'xtv_YbUoW8zn-Q4gGY8s2MksmHDjecSw6blkeIPFtyQ'),  # Replace with your actual API key
                'tier': 'fast'
                # 1. try adding fast here?
            }

            print("Sending request to transcription API...")
            response = requests.post('https://api.symphoniclabs.com/transcribe', files=files)

            if response.status_code != 200:
                print("Error calling Symphonic Labs API:", response.text)
                return jsonify({"error": "Transcription API error", "details": response.text}), 500
            
            data = response.json()
            print("Received response from transcription API:", data)

            # Return the transcription result
            return data

    except Exception as e:
        print("An error occurred during transcription:", str(e))
        return jsonify({"error": "An error occurred during transcription", "details": str(e)}), 500



# @app.route("/api/transcribe", methods=["POST"])
# def transcribe():
#     print("hi")
#     API_KEY = os.getenv("API_KEY")
#     if "video" not in request.files:
#         return jsonify({"error": "No video file uploaded"}), 400

#     video_file = request.files["video"]
#     # Debug: Inspect the uploaded file
#     print(f"Uploaded video file name: {video_file.filename}")
#     print(f"Uploaded video content type: {video_file.content_type}")
    
#     video = io.BytesIO(video_file.read())

#     try:
#         print(API_KEY)
#         url = "https://api.symphoniclabs.com/transcribe"
#         files = {
#             'video': #("input.webm", video, "video/webm"),
#             'api_key': (None, API_KEY),
#         }
#         response = requests.post(url, files=files, timeout=300)
#         response.raise_for_status()
#         transcribed_text = response.json()
#         return jsonify({"transcription": transcribed_text})
#     except requests.exceptions.RequestException as e:
#         print("Error calling Symphonic Labs API:")
#         return jsonify({"error": "Failed to transcribe video"}), 500


@app.route("/api/convert-to-mp4", methods=["POST"])
def convert_to_mp4():
    print("hello mp4")
    if "video" not in request.files:
        return jsonify({"error": "No video file uploaded"}), 400

    video = request.files["video"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_input:
        video.save(temp_input) # ohh actually saving the file here?
        temp_input_path = temp_input.name

    temp_output_path = temp_input_path.replace(".webm", ".mp4")

    try:
        result = subprocess.run(
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
            capture_output=True,
        )
        return send_file(
            temp_output_path, as_attachment=True, download_name="converted_video.mp4"
        )
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg error: {e.stderr.decode()}")
        return jsonify({"error": "Conversion failed", "details": e.stderr.decode()}), 500
    finally:
        os.unlink(temp_input_path)
        if os.path.exists(temp_output_path):
            os.unlink(temp_output_path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# import requests
# import io
# import subprocess
# import os
# import tempfile

# API_KEY = os.getenv("API_KEY")  # Ensure this is set in your environment

# app = Flask(__name__)
# CORS(
#     app,
#     resources={
#         r"/*": {"origins": "http://localhost:5173", "supports_credentials": True}
#     },
# )


# # @app.route("/", methods=["GET"])
# # def root():
# #     return "Hello World"

# # # update with the public endpoint.
# # @app.route("/api/transcribe", methods=["POST"])
# # def transcribe():
# #     if "video" not in request.files:
# #         return jsonify({"error": "No video file uploaded"}), 400

# #     video_file = request.files["video"]
# #     video = io.BytesIO(video_file.read())

# #     try:
# #         url = "https://api.symphoniclabs.com/transcribe"
# #         files = {
# #             'video': (video_file.filename, video),  # Use the uploaded file's filename
# #             'api_key': API_KEY,      # Include the API key
# #         }
# #         response = requests.post(url, files=files)
# #         response.raise_for_status()  # Raise an error for bad responses
        
# #         transcribed_text = response.json()
# #         return jsonify({"transcription": transcribed_text})
    
# #     # try:
# #     #     url = "https://api.symphoniclabs.com/transcribe" #"https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run"
# #     #     response = requests.post(
# #     #         url, files={"video": ("input.webm", video, "video/webm")}
# #     #     )
# #     #     response.raise_for_status()
# #     #     transcribed_text = response.text
# #     #     return jsonify({"transcription": transcribed_text})
# #     except requests.exceptions.RequestException as e:
# #         print(f"Error calling Symphonic Labs API: {e}")
# #         return jsonify({"error": "Failed to transcribe video"}), 500


# # @app.route("/api/convert-to-mp4", methods=["POST"]) # no change should be needed.
# # def convert_to_mp4():
# #     if "video" not in request.files:
# #         return "No video file", 400

# #     video = request.files["video"]

# #     with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_input:
# #         video.save(temp_input)
# #         temp_input_path = temp_input.name

# #     temp_output_path = temp_input_path.replace(".webm", ".mp4")

# #     try:
# #         subprocess.run(
# #             [
# #                 "ffmpeg",
# #                 "-i",
# #                 temp_input_path,
# #                 "-c:v",
# #                 "libx264",
# #                 "-preset",
# #                 "fast",
# #                 temp_output_path,
# #             ],
# #             check=True,
# #         )

# #         return send_file(
# #             temp_output_path, as_attachment=True, download_name="converted_video.mp4"
# #         )
# #     except subprocess.CalledProcessError as e:
# #         return f"Conversion failed: {str(e)}", 500
# #     finally:
# #         os.unlink(temp_input_path)
# #         if os.path.exists(temp_output_path):
# #             os.unlink(temp_output_path)


# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
