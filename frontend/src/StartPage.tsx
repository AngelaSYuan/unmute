import React, { useState } from "react";

const StartPage: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const transcribeVideo = async (file: File) => {
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
            console.log("Transcription result!!:", transcriptionData);

            return transcriptionData.text || "No transcription available"; // Default to message if empty
        } catch (error) {
            console.error("Error processing video:", error);
            throw error;
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setVideoFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!videoFile) {
            setErrorMessage("Please select a video file to upload.");
            return;
        }

        try {
            const transcriptionResult = await transcribeVideo(videoFile);
            setTranscription(transcriptionResult);
            console.log("The transcription: ");
            console.log(transcription);
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage("Error processing the video. Please try again.");
        }
    };

    return (
        <div>
            <h1>Upload and Transcribe Video</h1>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Transcribe</button>
            {transcription && <p style={{ color: "blue" }}>Transcription: {transcription}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
};

export default StartPage;
