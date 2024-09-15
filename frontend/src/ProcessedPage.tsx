import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Download from './assets/download.svg';
import Record from './assets/record.png';
import VideoPlayerWithCaptions from './VideoPlayerWithCaptions';

function ProcessedPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [transcription, setTranscription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [videoURL, setVideoURL] = useState('');

    useEffect(() => {
        if (location.state && location.state.videoBlob) {
            const url = URL.createObjectURL(location.state.videoBlob);
            setVideoURL(url);
            transcribeVideo(location.state.videoBlob);
        }
    }, [location.state]);

    const transcribeVideo = async (videoBlob) => {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('video', videoBlob, 'recorded_video.webm');

        try {
            console.log('Requesting transcription...');
            const response = await fetch('http://127.0.0.1:5000/api/transcribe', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Received response from backend:', data);
            if (data.transcription) {
                setTranscription(data.transcription);
                console.log('Transcription set:', data.transcription);
            } else {
                console.error('No transcription in response:', data);
                setTranscription(`Error: ${data.error || 'Failed to transcribe video'}`);
            }
        } catch (error) {
            console.error('Error transcribing video:', error);
            setTranscription(`Error: ${error.message || 'Failed to transcribe video'}`);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadVideo = () => {
        if (location.state && location.state.videoBlob) {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = videoURL;
            a.download = 'recorded_video.webm';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(videoURL);
        }
    };

    const handleRecordNewVideo = () => {
        navigate('/?record=true');
    };

    return (
        <div className="container">
            <Header />
            <div className="videoContainer">
                <div style={{ width: '100%', maxWidth: '640px' }}>
                    {videoURL && (
                        <VideoPlayerWithCaptions
                            videoSrc={videoURL}
                            captions={transcription}
                        />
                    )}
                </div>
                <div style={{display: "flex", width: '100%'}}>
                    <button className="button purple" onClick={handleRecordNewVideo} style={{width: '50%'}}>
                        <img src={Record} alt="Record new video"/>
                        Record New Video
                    </button>
                    <button className="button black" onClick={handleDownloadVideo} style={{width: '50%'}}>
                        <img src={Download} alt="Download video"/>
                        Download video
                    </button>
                </div>
                {isProcessing && <p>Processing video...</p>}
            </div>
            <h3>Speak, Even When You Can't.</h3>
        </div>
    );
}

export default ProcessedPage;
