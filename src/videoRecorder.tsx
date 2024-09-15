import React, { useState, useEffect, useImperativeHandle, useRef } from 'react';

// Define a type for the return value (videoBlob)
export type VideoRecorderReturn = {
  videoBlob: Blob | null;
  startRecording: () => void;
  stopRecording: () => void;
};

const useVideoRecorder = (): VideoRecorderReturn => {
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error('Error accessing webcam:', err));
    }
  }, []);

  const startRecording = () => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    const stream = videoRef.current.srcObject as MediaStream;
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      setVideoBlob(blob);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return { videoBlob, startRecording, stopRecording };
};


// Forward the ref from the parent to the video element inside the component
export const VideoRecorder = React.forwardRef((_, ref) => { // Remove props if unused
    const videoRef = useRef<HTMLVideoElement>(null);
  
    useImperativeHandle(ref, () => ({
      getVideoElement: () => videoRef.current,
    }));
  
    return (
      <div>
        <video ref={videoRef} autoPlay muted />
      </div>
    );
  });
  
export default useVideoRecorder;
