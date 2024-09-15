import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerWithCaptionsProps {
    videoSrc: string;
    captions: string;
}

const VideoPlayerWithCaptions: React.FC<VideoPlayerWithCaptionsProps> = ({ videoSrc, captions }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const captionsRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        const captionsElement = captionsRef.current;

        if (video && captionsElement) {
            const updateCaptions = () => {
                const progress = video.currentTime / video.duration;
                const scrollAmount = (captionsElement.scrollHeight - captionsElement.clientHeight) * progress;
                captionsElement.scrollTop = scrollAmount;
            };

            video.addEventListener('timeupdate', updateCaptions);
            return () => video.removeEventListener('timeupdate', updateCaptions);
        }
    }, [captions]);

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (video) {
            if (video.paused) {
                video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '640px' }}>
            <video
                ref={videoRef}
                src={videoSrc}
                style={{ width: '100%', height: 'auto' }}
                onClick={togglePlayPause}
            />
            <div
                ref={captionsRef}
                style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    padding: '10px',
                    maxHeight: '30%',
                    overflowY: 'hidden',
                    textAlign: 'center',
                    fontSize: '16px',
                    lineHeight: '1.5',
                }}
            >
                {captions}
            </div>
            <button
                onClick={togglePlayPause}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '48px',
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    opacity: isPlaying ? 0 : 1,
                    transition: 'opacity 0.3s',
                }}
            >
                {isPlaying ? '❚❚' : '▶'}
            </button>
        </div>
    );
};

export default VideoPlayerWithCaptions;