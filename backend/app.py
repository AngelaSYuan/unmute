from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
import io
from gtts import gTTS
import os
import moviepy.editor as mp
from pydub import AudioSegment

app = Flask(__name__, static_folder='../frontend/src', static_url_path='')

# Configure CORS to allow requests from your React app
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

def transcribe(file_path):
    url = "https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run"

    with open(file_path, 'rb') as video_file:
        video = io.BytesIO(video_file.read())

    response = requests.post(url, files={'video': ('input.mp4', video, 'video/mp4')})

    return(response.text)

def translate_to_spanish(text):
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "auto",
        "tl": "es",
        "dt": "t",
        "q": text
    }
    response = requests.get(url, params=params)
    return ''.join([sentence[0] for sentence in response.json()[0]])

@app.route('/')
def index():
    return "Welcome to the video processing app!"

@app.route('/api/process_video', methods=['POST'])
def process_video():
    print("Received request to /api/process_video")
    if 'video' not in request.files:
        print("No video file in request")
        return jsonify({"error": 'No video file uploaded'}), 400
    
    video_file = request.files['video']
    print(f"Received file: {video_file.filename}")
    temp_video_path = 'temp_video.mp4'
    video_file.save(temp_video_path)
    print(f"Saved file to {temp_video_path}")

    try:
        transcribed_text = transcribe(temp_video_path)
        print("Transcription complete")
        spanish_text = translate_to_spanish(transcribed_text)
        print("Translation complete")

        tts = gTTS(text=spanish_text, lang='es', slow=False)

        video = mp.VideoFileClip(temp_video_path)
        video_duration = video.duration

        TEMP_AUDIO_FILE = "temp_output.mp3"
        tts.save(TEMP_AUDIO_FILE)
        print(f"Saved audio to {TEMP_AUDIO_FILE}")

        audio = AudioSegment.from_mp3(TEMP_AUDIO_FILE)
        adjusted_audio = audio.set_frame_rate(int(len(audio) / video_duration * 1000))

        output_file = "output_spanish.mp3"
        adjusted_audio.export(output_file, format="mp3")
        print(f"Exported final audio to {output_file}")

        video.close()
        os.remove(TEMP_AUDIO_FILE)
        os.remove(temp_video_path)
        print("Cleaned up temporary files")

        return jsonify({"result": "Video processed successfully"})
    except Exception as e:
        print(f"Error processing video: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    app.run(debug=True)
