
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  prompt: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, prompt }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Your Generated Video</h2>
      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden shadow-2xl">
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-400">Prompt:</p>
        <p className="text-gray-200 italic">"{prompt}"</p>
      </div>
    </div>
  );
};
