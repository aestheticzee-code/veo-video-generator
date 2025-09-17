
import React, { useState, useEffect } from 'react';

interface LoadingIndicatorProps {
  status: string;
}

const reassuringMessages = [
    "Contacting the digital muses...",
    "Warming up the pixels...",
    "Teaching the AI about cinematography...",
    "This can take a few minutes, time for a quick stretch!",
    "Assembling bits and bytes into a masterpiece...",
    "Rendering your vision into reality...",
    "Patience is a virtue, especially with high-tech art!",
    "The AI is hard at work, great things take time."
];

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ status }) => {
    const [message, setMessage] = useState(reassuringMessages[0]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prev => {
                const currentIndex = reassuringMessages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % reassuringMessages.length;
                return reassuringMessages[nextIndex];
            });
        }, 5000); // Change message every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="text-center p-8 bg-gray-800 rounded-lg shadow-xl max-w-md mx-auto">
            <div className="flex justify-center items-center mb-4">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <p className="text-lg font-semibold text-gray-200 mb-2">{status}</p>
            <p className="text-gray-400 text-sm">{message}</p>
        </div>
    );
};
