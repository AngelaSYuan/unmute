import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './Header';
import Record from './assets/record.png';
import './App.css';

function StartPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isRecording, setIsRecording] = useState(false);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        async function setupCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                // Start recording immediately if coming from ProcessedPage
                if (location.search === '?record=true') {
                    startRecording(stream);
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        }
        setupCamera();
    }, [location.search]);

    const handleRecording = () => {
        if (!isRecording) {
            setCountdown(3);
        } else {
            stopRecording();
        }
    }

    useEffect(() => {
        let timer;
        if (countdown !== null && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0) {
            startRecording(videoRef.current.srcObject);
            setCountdown(null);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const startRecording = (stream) => {
        setIsRecording(true);
        setRecordedChunks([]);
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();
    }

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    }

    const handleDataAvailable = (event) => {
        if (event.data.size > 0) {
            setRecordedChunks((prev) => prev.concat(event.data));
        }
    }

    useEffect(() => {
        if (recordedChunks.length > 0 && !isRecording) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            navigate('/processed', { state: { videoBlob: blob } });
        }
    }, [recordedChunks, isRecording, navigate]);

    return (
        <div className="container">
            <Header />
            <div className={`videoContainer  ${isRecording && "red-border"}`}>
                <video className = "videoEffect"ref={videoRef} autoPlay muted playsInline style={{width: '100%', height: 'auto'}} />
                {countdown !== null && (
                    <div className="countdown">{countdown === 0 ? 'Go!' : countdown}</div>
                )}
                <button className={`button ${isRecording ? 'red' : 'purple'}`} onClick={handleRecording} style={{width:'100%'}} disabled={countdown !== null}>
                    <img src={Record} alt="Record button"/>
                    {isRecording ? 'Stop recording' : 'Record video'}
                </button>
            </div>
            <h3>Speak, Even When You Can't.</h3>
        </div>
    );
}

export default StartPage;
