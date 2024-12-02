// VideoPlayerWithCaptions.tsx

import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerWithCaptionsProps {
    videoSrc: string;
    captions: string; // We'll keep this prop for speech synthesis
}

const VideoPlayerWithCaptions: React.FC<VideoPlayerWithCaptionsProps> = ({ videoSrc, captions }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;

        if (video) {
            const handlePlay = () => {
                setIsPlaying(true);
                setIsEnded(false);

                // Start speech synthesis
                window.speechSynthesis.cancel(); // Cancel any existing speech
                const utterance = new SpeechSynthesisUtterance(captions);
                window.speechSynthesis.speak(utterance);
            };

            const handleEnded = () => {
                setIsPlaying(false);
                setIsEnded(true);

                // Stop speech synthesis
                window.speechSynthesis.cancel();
            };

            const handlePause = () => {
                setIsPlaying(false);

                // Pause speech synthesis
                window.speechSynthesis.pause();
            };

            video.addEventListener('play', handlePlay);
            video.addEventListener('ended', handleEnded);
            video.addEventListener('pause', handlePause);

            return () => {
                video.removeEventListener('play', handlePlay);
                video.removeEventListener('ended', handleEnded);
                video.removeEventListener('pause', handlePause);
            };
        }
    }, [captions]);

    const handleControlButtonClick = () => {
        const video = videoRef.current;
        if (video) {
            if (isPlaying) {
                // Pause the video
                video.pause();
                setIsPlaying(false);

                // Pause speech synthesis
                window.speechSynthesis.pause();
            } else if (isEnded || video.currentTime > 0) {
                // Replay the video from the beginning
                video.currentTime = 0;
                window.speechSynthesis.cancel(); // Cancel any existing speech
                video.play();
            } else {
                // Start playing the video from the beginning
                window.speechSynthesis.cancel(); // Cancel any existing speech
                video.play();
            }
        }
    };

    // Determine the icon based on the state
    let controlIcon = '';
    let controlLabel = '';
    let iconClass = '';

    if (isPlaying) {
        controlIcon = '■'; // Stop icon
        controlLabel = 'Stop';
        iconClass = 'stop';
    } else if (isEnded || (!isPlaying && videoRef.current && videoRef.current.currentTime > 0)) {
        controlIcon = '↻'; // Replay icon
        controlLabel = 'Replay';
        iconClass = 'replay';
    } else {
        controlIcon = '▶'; // Play icon
        controlLabel = 'Play';
        iconClass = 'play';
    }

    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            <video
                ref={videoRef}
                src={videoSrc}
                style={{ borderRadius: '12px', width: '100%' }}
                controls={false} // Hide default controls
            />
            {/* Captions overlay removed */}
            {/* Custom Control Button */}
            <button
                onClick={handleControlButtonClick}
                className="video-control-button"
                aria-label={controlLabel}
            >
                <span className={`control-icon ${iconClass}`}>{controlIcon}</span>
            </button>
        </div>
    );
};

export default VideoPlayerWithCaptions;