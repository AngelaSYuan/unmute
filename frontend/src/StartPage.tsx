// StartPage.tsx

import React, { useState } from "react";
import Header from './Header';
import VideoPlayerWithCaptions from './VideoPlayerWithCaptions';
import './App.css';

const StartPage: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [videoURL, setVideoURL] = useState<string>('');
    const [isTranscribed, setIsTranscribed] = useState<boolean>(false);

    const transcribeVideo = async (file: File) => {
        setIsProcessing(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Step 1: Upload the file to the Flask server
            const uploadResponse = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadResponse.ok) {
                const errorText = await uploadResponse.text();
                throw new Error(`Upload failed! status: ${uploadResponse.status}, message: ${errorText}`);
            }

            const uploadData = await uploadResponse.json();
            console.log("File uploaded:", uploadData);

            // Step 2: Request transcription using the file path from upload response
            const transcribeResponse = await fetch(`http://127.0.0.1:5000/api/transcribe?file_path=${encodeURIComponent(uploadData.filepath)}`, {
                method: "POST",
            });

            if (!transcribeResponse.ok) {
                const errorText = await transcribeResponse.text();
                throw new Error(`Transcription failed! status: ${transcribeResponse.status}, message: ${errorText}`);
            }

            const transcriptionData = await transcribeResponse.json();
            console.log("Transcription result:", transcriptionData);

            setTranscription(transcriptionData.text || "No transcription available");
            setErrorMessage('');
            setIsTranscribed(true);
            speakTranscription(transcriptionData.text || "No transcription available");
        } catch (error: any) {
            console.error("Error processing video:", error);
            setErrorMessage("Error processing the video. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setVideoFile(event.target.files[0]);
            setVideoURL(URL.createObjectURL(event.target.files[0]));
            setIsTranscribed(false); // Reset transcription state when new file is selected
        }
    };

    const handleUpload = async () => {
        if (!videoFile) {
            setErrorMessage("Please select a video file to upload.");
            return;
        }

        await transcribeVideo(videoFile);
    };

    const speakTranscription = (text: string) => {
        if (!window.speechSynthesis) {
            console.error("SpeechSynthesis API is not supported in this browser.");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="container">
            <Header />
            <div className="upload-container">
                <h1>Upload and Transcribe Video</h1>
                {/* Begin grouping the input and button */}
                <div className="input-button-group">
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        id="fileInput"
                        style={{ display: 'none' }} // Hide the default file input
                    />
                    <label htmlFor="fileInput" className="button black">
                        Choose File
                    </label>
                    <button
                        className="button purple"
                        onClick={handleUpload}
                        disabled={isProcessing || !videoFile}
                    >
                        {isProcessing ? 'Processing...' : 'Upload and Transcribe'}
                    </button>
                </div>
                {/* End grouping */}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </div>
            {videoFile && (
                <div className="videoContainer">
                    <VideoPlayerWithCaptions
                        videoSrc={videoURL}
                        captions={isTranscribed ? transcription : ''}
                    />
                </div>
            )}
            {isTranscribed && (
                <div className="transcription-container">
                    <h2>Transcription</h2>
                    <p>{transcription}</p>
                </div>
            )}
        </div>
    );
};

export default StartPage;