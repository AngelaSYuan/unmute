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
                playAnimation();
                video.play();
                setIsPlaying(true);
            } else {
                video.pause();
                setIsPlaying(false);
            }
        }
    };

    const playAnimation = () => {
        const video = videoRef.current;
        if (captionsRef.current && videoRef.current) {
            captionsRef.current.style.animation = 'none';
            captionsRef.current.offsetHeight;
            captionsRef.current.style.animation =  `scroll-text ${video.duration}s linear 1 forwards`;
        }
    };

    return (
        <div style={{ position: 'relative', overflow:'hidden'}}>
            <video
                ref={videoRef}
                src={videoSrc}
                style={{ borderRadius: '12px' }}
                onClick={togglePlayPause}
            />
            <div
                ref={captionsRef}
                className="scrolling-text"
                id="scroll-text"
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