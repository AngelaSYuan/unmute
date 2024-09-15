import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Download from './assets/download.svg';
import Record from './assets/record.png';

function ProcessedPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef(null);

    useEffect(() => {
        if (location.state && location.state.videoBlob) {
            const videoURL = URL.createObjectURL(location.state.videoBlob);
            if (videoRef.current) {
                videoRef.current.src = videoURL;
            }
        }
    }, [location.state]);

    const handleDownloadVideo = () => {
        if (location.state && location.state.videoBlob) {
            const url = URL.createObjectURL(location.state.videoBlob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'recorded_video.webm';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    const handleRecordNewVideo = () => {
        navigate('/?record=true');
    };

    return (
        <div className="container">
            <Header />
            <div className="videoContainer">
                {location.state && location.state.videoBlob && (
                    <video 
                        ref={videoRef} 
                        controls 
                        style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '640px'
                        }}
                    />
                )}
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
