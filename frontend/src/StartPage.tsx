import React, { useState } from "react";

const StartPage: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const transcribeVideo = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log("File uploaded:", data);
            return data.transcription;
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
            setErrorMessage(null);
        } catch (error) {
            setErrorMessage("Error processing the video. Please try again.");
        }
    };

    return (
        <div className="container">
            <h1>Upload and Transcribe Video!!</h1>
            <input type="file" accept="video/*" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload and Transcribe</button>
            {transcription && <p>Transcription: {transcription}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </div>
    );
};

export default StartPage;


// import React, { useState } from 'react';
// import Header from './Header';
// import './App.css';

// function StartPage() {
//     const [transcription, setTranscription] = useState('');
//     const [selectedFile, setSelectedFile] = useState(null);

//     // Handle file selection
//     const handleFileChange = (e) => {
//         const file = e.target.files[0];  // Get the selected file
//         if (file) {
//             setSelectedFile(file);  // Store the selected file in state. format tho...?
//             console.log("HI");
//             console.log(file);
//             //console.log(selectedFile);
//         }
//     };

//     // Handle video file upload and transcription
//     const transcribeVideo = async (e) => {
//         e.preventDefault();
    
//         if (!selectedFile) {
//             alert('Please select a video file to upload.');
//             return;
//         }
    
//         try {
//             // Step 1: Upload the video file
//             const formData = new FormData();
//             formData.append('file', selectedFile);
    
//             const uploadResponse = await fetch('', {
//                 method: 'POST',
//                 body: formData,
//             });
    
//             if (!uploadResponse.ok) {
//                 const errorText = await uploadResponse.text();
//                 throw new Error(`Upload failed! status: ${uploadResponse.status}, message: ${errorText}`);
//             }
    
//             const uploadData = await uploadResponse.json();
//             const filePath = uploadData.filepath; // Path to the uploaded file
    
//             console.log('File uploaded successfully:', filePath);
    
//             // Step 2: Transcribe the video
//             const transcribeResponse = await fetch(`/api/transcribe?file_path=${encodeURIComponent(filePath)}`, {
//                 method: 'POST',
//             });
    
//             if (!transcribeResponse.ok) {
//                 const errorText = await transcribeResponse.text();
//                 throw new Error(`Transcription failed! status: ${transcribeResponse.status}, message: ${errorText}`);
//             }
    
//             const transcribeData = await transcribeResponse.json();
//             console.log('Transcription received:', transcribeData);
    
//             if (transcribeData.transcription) {
//                 setTranscription(transcribeData.transcription);
//             } else {
//                 setTranscription(`Error: ${transcribeData.error || 'Failed to transcribe video'}`);
//             }
//         } catch (error) {
//             console.error('Error processing video:', error);
//             setTranscription('Error: Failed to process video');
//         }
//     };
    

//     return (
//         <div className="container">
//             <Header />
//             <form onSubmit={transcribeVideo}>
//                 {/* File input field for the user to select a video */}
//                 <input
//                     type="file"
//                     accept="video/*"  // Only allow video files
//                     onChange={handleFileChange}  // Handle file selection
//                 />
//                 <button type="submit" disabled={!selectedFile}>Upload Video</button>
//             </form>

//             {/* Display transcription here */}
//             <div>
//                 {transcription ? (
//                     <div>
//                         <h3>Transcription:</h3>
//                         <p>{transcription}</p>
//                     </div>
//                 ) : (
//                     <p>No transcription available.</p>
//                 )}
//             </div>

//             <h3>Speak, Even When You Can't.</h3>
//         </div>
//     );
// }

// /*
// h1>Click to Open File Browser</h1> <!-- Hidden file input --> <input type="file" id="fileInput" style="display: none;" /> <!-- Custom button --> <button id="uploadButton">Select File</button> <script> // Reference to button and file input const uploadButton = document.getElementById('uploadButton'); const fileInput = document.getElementById('fileInput'); // Add event listener to button to trigger file input click uploadButton.addEventListener('click', () => { fileInput.click(); // Opens the user's file browser }); // Optional: Handle file selection fileInput.addEventListener('change', () => { if (fileInput.files.length > 0) { alert(`You selected: ${fileInput.files[0].name}`); } });
// */

// export default StartPage;

//  // Step 1: Upload the file
//         // let filepath;
//         // const formData = new FormData();
//         // formData.append('video', selectedFile);  // Add the selected file to FormData

//         // try {
//         //     const response = await fetch('/upload', {
//         //         method: 'POST',
//         //         body: formData,  // Send the file as form data
//         //     });

//         //     if (!response.ok) {
//         //         throw new Error('Error uploading video.');
//         //     }

//         //     const data = await response.json();
//         //     filepath = data.filepath;  // Assuming this returns the file path after upload
//         // }
//         // catch (error) {
//         //     console.error('Error uploading video:', error);
//         //     setTranscription('Error uploading video.');
//         //     return;
//         // }

//         // Step 2: Transcribe the MP4 video