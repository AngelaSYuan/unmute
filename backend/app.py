import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Configure Flask CORS for specific origins
CORS(app, resources={r"/*": {"origins": "http://localhost:8000"}})

# Configure upload folder and allowed file extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Helper function to validate file extensions
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Upload endpoint
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400
    if file and allowed_file(file.filename):
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        print(f"File saved to: {filepath}")  # Debugging log
        return jsonify({"filepath": filepath}), 200
    return jsonify({"error": "Invalid file type"}), 400

# Transcription endpoint
@app.route('/api/transcribe', methods=['POST'])
def transcribe():
    filepath = request.args.get('file_path')
    if not filepath or not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 400

    try:
        with open(filepath, 'rb') as f:
            files = {
                'video': (filepath, f),
                'api_key': (None, '_EoKVaff_WJTH0gAOYAtr8fiQcWCattOnECFWmqnfrE'),  # Replace with actual API key
                'segment_time': (None, '20'),
            }
            response = requests.post('https://api.symphoniclabs.com/transcribe', files=files)

            # Ensure the external API request was successful
            if response.status_code != 200:
                return jsonify({"error": "Transcription API failed", "details": response.text}), 500

            return jsonify(response.json()), 200
    except Exception as e:
        return jsonify({"error": "Failed to process transcription", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5000)
