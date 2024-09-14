
import requests
import io

# Assuming video.mp4 exists

def transcribe(file_path):
    url = "https://symphoniclabs--symphonet-vsr-modal-htn-model-upload-static-htn.modal.run"

    with open(file_path, 'rb') as video_file:
        video = io.BytesIO(video_file.read())

    response = requests.post(url, files={'video': ('input.mp4', video, 'video/mp4')})

    return(response.text)

# Use your video file here
your_video_path = "Symphonic Test.mov"
print(transcribe(your_video_path))
