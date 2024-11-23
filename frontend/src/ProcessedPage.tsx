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
            const url = URL.createObjectURL(location.state.videoBlob); //setting url from the blob location (what we recorded.)
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
    
    // Step 1: Convert video to MP4
    const mp4Blob = await convertVideoToMp4(videoBlob);
    if (!mp4Blob) {
        setIsProcessing(false);
        return; // If conversion fails, exit the function
    }

    // Step 2: Transcribe the MP4 video
    const formData = new FormData();
    formData.append('video', mp4Blob, 'recorded_video.mp4'); // Now sending mp4 video

    try {
        console.log('Requesting transcription...');
        const response = await fetch('https://api.symphoniclabs.com/transcribe', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Received response:', data);
        
        if (data.transcription) { 
            setTranscription(data.transcription);
            speakTranscription(data.transcription);
        } else {
            setTranscription(`Error: ${data.error || 'Failed to transcribe video'}`);
        }
    } catch (error) {
        console.error('Error transcribing video:', error);
        setTranscription(`Error: ${error.message || 'Failed to transcribe video'}`);
    } finally {
        setIsProcessing(false);
    }
};

const convertVideoToMp4 = async (videoBlob) => {
    const formData = new FormData();
    formData.append('video', videoBlob, 'recorded_video.webm'); // Send the webm file for conversion

    try {
        console.log('Sending video for conversion...');
        const response = await fetch('http://127.0.0.1:5000/api/convert-to-mp4', { // Make sure this URL is correct
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        console.log('Conversion successful, returning MP4 Blob...');
        return await response.blob(); // Return the converted MP4 blob
    } catch (error) {
        console.error('Error converting video:', error);
        alert(`Failed to convert video: ${error.message}`);
        return null; // Return null if conversion fails
    }
};


    const handleDownloadVideo = async () => {
        if (location.state && location.state.videoBlob) {
            try {
                const formData = new FormData();
                formData.append('video', location.state.videoBlob, 'recorded_video.webm');

                console.log('Sending video for conversion...');
                const response = await fetch('http://127.0.0.1:5000/api/convert-to-mp4', { //https://backend.unmutenow.co/api/convert-to-mp4'
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
                        captions={transcription} 
                        key={transcription} />

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
