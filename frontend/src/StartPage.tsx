import React, { useState } from 'react';
import Header from './Header';
import './App.css';

function StartPage() {
    const [transcription, setTranscription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];  // Get the selected file
        if (file) {
            setSelectedFile(file);  // Store the selected file in state
            console.log(file);
            //console.log(selectedFile);
        }
    };

    // Handle video file upload and transcription
    const transcribeVideo = async (e) => {
        e.preventDefault();  // Prevent form from refreshing the page on submit

        if (!selectedFile) {
            alert('Please select a video file to upload.');
            return;
        }

        // Step 1: Upload the file
        // let filepath;
        // const formData = new FormData();
        // formData.append('video', selectedFile);  // Add the selected file to FormData

        // try {
        //     const response = await fetch('/upload', {
        //         method: 'POST',
        //         body: formData,  // Send the file as form data
        //     });

        //     if (!response.ok) {
        //         throw new Error('Error uploading video.');
        //     }

        //     const data = await response.json();
        //     filepath = data.filepath;  // Assuming this returns the file path after upload
        // }
        // catch (error) {
        //     console.error('Error uploading video:', error);
        //     setTranscription('Error uploading video.');
        //     return;
        // }

        // Step 2: Transcribe the MP4 video
        try {
            console.log('Requesting transcription...');
            const response = await fetch(`/api/transcribe?file_path=${selectedFile}`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('Received response:', data);

            if (data.transcription) {
                setTranscription(data.transcription);
            } else {
                setTranscription(`Error: ${data.error || 'Failed to transcribe video'}`);
            }
        } catch (error) {
            console.error('Error transcribing video:', error);
            setTranscription('Error: Failed to transcribe video');
        }
    };

    return (
        <div className="container">
            <Header />
            <form onSubmit={transcribeVideo}>
                {/* File input field for the user to select a video */}
                <input
                    type="file"
                    accept="video/*"  // Only allow video files
                    onChange={handleFileChange}  // Handle file selection
                />
                <button type="submit" disabled={!selectedFile}>Upload Video</button>
            </form>

            {/* Display transcription here */}
            <div>
                {transcription ? (
                    <div>
                        <h3>Transcription:</h3>
                        <p>{transcription}</p>
                    </div>
                ) : (
                    <p>No transcription available.</p>
                )}
            </div>

            <h3>Speak, Even When You Can't.</h3>
        </div>
    );
}

/*
h1>Click to Open File Browser</h1> <!-- Hidden file input --> <input type="file" id="fileInput" style="display: none;" /> <!-- Custom button --> <button id="uploadButton">Select File</button> <script> // Reference to button and file input const uploadButton = document.getElementById('uploadButton'); const fileInput = document.getElementById('fileInput'); // Add event listener to button to trigger file input click uploadButton.addEventListener('click', () => { fileInput.click(); // Opens the user's file browser }); // Optional: Handle file selection fileInput.addEventListener('change', () => { if (fileInput.files.length > 0) { alert(`You selected: ${fileInput.files[0].name}`); } });
*/

export default StartPage;