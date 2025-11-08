import React, { useState, useRef, useEffect, useCallback } from 'react';

interface CharacterCaptureProps {
  onCapture: (imageBase64: string) => void;
}

const CharacterCapture: React.FC<CharacterCaptureProps> = ({ onCapture }) => {
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const setupCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Could not access camera. Please grant permission and refresh.");
    }
  }, []);

  useEffect(() => {
    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [setupCamera]);
  
  const handleCaptureClick = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        // Flip the context horizontally to match the mirrored video feed
        context.translate(video.videoWidth, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        // Reset the transformation
        context.setTransform(1, 0, 0, 1, 0, 0);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64Data = dataUrl.split(',')[1];
        onCapture(base64Data);
      }
    }
  };

  if (cameraError) {
    return <div className="text-center text-red-400 p-8 bg-red-900/50 border border-red-500">{cameraError}</div>;
  }
  
  return (
    <div className="w-full max-w-2xl text-center">
        <div className="bg-black p-8 border border-gray-800">
            <h2 className="text-3xl font-bold text-white mb-2">Pose for Your Character</h2>
            <p className="text-gray-500 mb-6">Strike a pose that defines your character. This image will be the base for the AI.</p>
            
            <div className="w-full relative aspect-video bg-black overflow-hidden border border-gray-700">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            <button 
                onClick={handleCaptureClick}
                className="mt-8 px-12 py-4 bg-white text-black font-bold text-2xl hover:bg-gray-300 transition-colors flex items-center justify-center gap-3 w-full"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h1.586a1 1 0 00.707-.293l1.414-1.414A1 1 0 018.414 2h3.172a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    <path d="M10 14a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
                Capture Pose & Generate Story
            </button>
        </div>
    </div>
  );
};

export default CharacterCapture;
