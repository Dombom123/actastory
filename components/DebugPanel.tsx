import React from 'react';

interface DebugPanelProps {
    characterImage: string | null;
    styleImage: string | null;
    currentBeat?: {
        capturedImage: string | null;
        openPoseImage: string | null;
        generatedImage: string | null;
    };
    onRetryCharacter?: () => void;
    onRetryStyle?: () => void;
    onRetryBeat?: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({
    characterImage,
    styleImage,
    currentBeat,
    onRetryCharacter,
    onRetryStyle,
    onRetryBeat
}) => {
    return (
        <div className="fixed top-16 right-4 w-80 bg-black/95 border border-yellow-500 p-4 max-h-[80vh] overflow-y-auto z-50">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h3 className="text-yellow-500 font-bold text-sm">DEBUG MODE</h3>
            </div>

            <div className="space-y-4 text-xs">
                {/* Character Image */}
                {characterImage && (
                    <div className="border border-gray-700 p-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 font-semibold">Character Image</span>
                            {onRetryCharacter && (
                                <button
                                    onClick={onRetryCharacter}
                                    className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-black text-xs font-bold"
                                >
                                    Retry
                                </button>
                            )}
                        </div>
                        <img 
                            src={`data:image/jpeg;base64,${characterImage}`} 
                            alt="Character" 
                            className="w-full aspect-video object-cover"
                        />
                    </div>
                )}

                {/* Style Image */}
                {styleImage && (
                    <div className="border border-gray-700 p-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 font-semibold">Style Image</span>
                            {onRetryStyle && (
                                <button
                                    onClick={onRetryStyle}
                                    className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-black text-xs font-bold"
                                >
                                    Retry
                                </button>
                            )}
                        </div>
                        <img 
                            src={`data:image/jpeg;base64,${styleImage}`} 
                            alt="Style" 
                            className="w-full aspect-video object-cover"
                        />
                    </div>
                )}

                {/* Current Beat Debug Info */}
                {currentBeat && (
                    <div className="border border-yellow-600 p-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-yellow-500 font-semibold">Current Beat</span>
                            {onRetryBeat && currentBeat.generatedImage && (
                                <button
                                    onClick={onRetryBeat}
                                    className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-black text-xs font-bold"
                                >
                                    Retry
                                </button>
                            )}
                        </div>

                        {/* Captured Webcam Image */}
                        {currentBeat.capturedImage && (
                            <div className="mb-2">
                                <span className="text-gray-500 text-xs block mb-1">1. Captured Image</span>
                                <img 
                                    src={`data:image/jpeg;base64,${currentBeat.capturedImage}`} 
                                    alt="Captured" 
                                    className="w-full aspect-video object-cover border border-gray-700"
                                />
                            </div>
                        )}

                        {/* OpenPose Image */}
                        {currentBeat.openPoseImage && (
                            <div className="mb-2">
                                <span className="text-gray-500 text-xs block mb-1">2. OpenPose</span>
                                <img 
                                    src={`data:image/jpeg;base64,${currentBeat.openPoseImage}`} 
                                    alt="OpenPose" 
                                    className="w-full aspect-video object-cover border border-gray-700"
                                />
                            </div>
                        )}

                        {/* Final Generated Image */}
                        {currentBeat.generatedImage && (
                            <div>
                                <span className="text-gray-500 text-xs block mb-1">3. Final Image</span>
                                <img 
                                    src={`data:image/jpeg;base64,${currentBeat.generatedImage}`} 
                                    alt="Generated" 
                                    className="w-full aspect-video object-cover border border-gray-700"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DebugPanel;

