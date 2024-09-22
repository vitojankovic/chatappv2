import React, { useRef, useEffect } from 'react';

interface VideoLoaderProps {
  src: string;
  width: number;
  height: number;
}

const VideoLoader: React.FC<VideoLoaderProps> = ({ src, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = document.createElement('video');
    video.src = src;
    video.crossOrigin = 'anonymous';

    video.onloadedmetadata = () => {
      canvas.width = width;
      canvas.height = height;

      const renderFrame = () => {
        ctx.drawImage(video, 0, 0, width, height);
        requestAnimationFrame(renderFrame);
      };

      video.play();
      renderFrame();
    };

    return () => {
      video.pause();
      video.remove();
    };
  }, [src, width, height]);

  return <canvas ref={canvasRef} />;
};

export default VideoLoader;
