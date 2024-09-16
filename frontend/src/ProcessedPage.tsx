import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Download from './assets/download.svg';
import Record from './assets/record.png';
import Spinner from './assets/spinner.svg';
import Logo from './assets/logo_color.png';
import VideoPlayerWithCaptions from './VideoPlayerWithCaptions';

function ProcessedPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [transcription, setTranscription] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [videoURL, setVideoURL] = useState('');
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (location.state && location.state.videoBlob) {
            const url = URL.createObjectURL(location.state.videoBlob);
            setVideoURL(url);
            transcribeVideo(location.state.videoBlob);
        }
    }, [location.state]);

    useEffect(() => {
        if (isProcessing) {
            setIsOverlayVisible(true);
        } else {
            const overlay = overlayRef.current;
            if (overlay) {
                overlay.addEventListener('transitionend', () => {
                    setIsOverlayVisible(false);
                }, { once: true });
                overlay.classList.add('fade-out');
            }
        }
    }, [isProcessing]);

    const speakTranscription = (text) => {
      if (!window.speechSynthesis) {
          console.error("SpeechSynthesis API is not supported in this browser.");
          return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
  };
  
    const transcribeVideo = async (videoBlob) => {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append('video', videoBlob, 'recorded_video.webm');

        try {
            console.log('Requesting transcription...');
            const response = await fetch('https://backend.unmutenow.co/api/transcribe', {
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
              speakTranscription(data.transcription); // Speak the transcription
              speakTranscription('');
          }
           else {
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

    const handleDownloadVideo = async () => {
        if (location.state && location.state.videoBlob) {
            try {
                const formData = new FormData();
                formData.append('video', location.state.videoBlob, 'recorded_video.webm');

                console.log('Sending video for conversion...');
                const response = await fetch('https://backend.unmutenow.co/api/convert-to-mp4', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
                }

                console.log('Conversion successful, downloading...');
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'recorded_video.mp4';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error('Error converting video:', error);
                alert(`Failed to convert and download video: ${error.message}`);
            }
        }
    };

    const handleRecordNewVideo = () => {
        navigate('/');
    };
    const removeQuotes = (text: string) => {
        return text.replace(/^"|"$/g, '');
    };

    return (
        <div className="container">
            {isOverlayVisible && (
                <div ref={overlayRef} className={`processing-overlay ${isProcessing ? '' : 'fade-out'}`}>
                    <div className="processing-content">
                        <div style={{display: "flex", alignItems: "center"}}>
                            <img src={Logo} alt="Unmute" width="100px"/>
                            <h2>-ing now...</h2>
                        </div>
                        <img src={Spinner} alt="Processing video" width="80px"/>
                    </div>
                </div>
            )}
            <Header />
            <div className="videoContainer">
                <div style={{ width: '100%', maxWidth: '640px' }}>
                    {videoURL && (
                        <VideoPlayerWithCaptions
                            videoSrc={videoURL}
                            captions={removeQuotes(transcription)}
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
            </div>
            <h3>Speak, Even When You Can't.</h3>
        </div>
    );
}

export default ProcessedPage;
