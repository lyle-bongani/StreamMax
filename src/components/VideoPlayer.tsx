import React from 'react';
import { X, Play, Pause, Maximize, Minimize } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onClose }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Video Container */}
      <div className="relative w-full h-full">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          controls={false}
        />

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-semibold">{title}</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                {isFullscreen ? (
                  <Minimize className="w-6 h-6 text-white" />
                ) : (
                  <Maximize className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer; 