from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import io

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173", "supports_credentials": True}})

@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    if 'video' not in request.files:
        return jsonify({"error": 'No video file uploaded'}), 400
    
    video_file = request.files['video']
    video = io.BytesIO(video_file.read())

    try:
        url = "https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run"
        response = requests.post(url, files={'video': ('input.webm', video, 'video/webm')})
        response.raise_for_status()
        transcribed_text = response.text
        return jsonify({"transcription": transcribed_text})
    except requests.exceptions.RequestException as e:
        print(f"Error calling Symphonic Labs API: {e}")
        return jsonify({"error": "Failed to transcribe video"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
