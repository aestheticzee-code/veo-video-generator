
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptForm } from './components/PromptForm';
import { LoadingIndicator } from './components/LoadingIndicator';
import { VideoPlayer } from './components/VideoPlayer';
import { generateVideo } from './services/geminiService';
import type { ImageFile } from './types';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [lastUsedPrompt, setLastUsedPrompt] = useState<string>('');
    const [image, setImage] = useState<ImageFile | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generationStatus, setGenerationStatus] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<string>('16:9');

    useEffect(() => {
        // Cleanup object URL to prevent memory leaks
        return () => {
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    setImage({ file, dataUrl: reader.result });
                }
            };
            reader.readAsDataURL(file);
        }
        e.target.value = ''; // Reset file input
    };

    const removeImage = () => {
        setImage(null);
    };

    const handleGenerateVideo = useCallback(async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setLastUsedPrompt(prompt);

        try {
            const generatedUrl = await generateVideo(prompt, image?.file || null, aspectRatio, setGenerationStatus);
            setVideoUrl(generatedUrl);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
            setGenerationStatus('');
        }
    }, [prompt, image, aspectRatio]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleGenerateVideo();
    };
    
    const handleDownload = useCallback(() => {
        if (!videoUrl) return;
        const link = document.createElement('a');
        link.href = videoUrl;

        // Create a safe filename from the prompt
        const safePrompt = lastUsedPrompt.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `${safePrompt.substring(0, 50) || 'veo-generated-video'}.mp4`;
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [videoUrl, lastUsedPrompt]);


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <main className="container mx-auto px-4 py-8">
                <Header />
                <div className="mt-10">
                    {!isLoading && !videoUrl && (
                        <PromptForm
                            prompt={prompt}
                            setPrompt={setPrompt}
                            image={image}
                            handleImageChange={handleImageChange}
                            removeImage={removeImage}
                            handleSubmit={handleSubmit}
                            isLoading={isLoading}
                            aspectRatio={aspectRatio}
                            setAspectRatio={setAspectRatio}
                        />
                    )}
                    {isLoading && <LoadingIndicator status={generationStatus} />}
                    
                    {error && (
                        <div className="mt-8 text-center p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg max-w-2xl mx-auto">
                            <p className="font-semibold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    {videoUrl && (
                        <>
                           <VideoPlayer videoUrl={videoUrl} prompt={lastUsedPrompt} />
                           <div className="text-center mt-8 flex justify-center items-center space-x-4">
                               <button 
                                   onClick={() => {
                                      setVideoUrl(null);
                                      setError(null);
                                   }}
                                   className="py-2 px-6 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300"
                               >
                                   Generate Another Video
                               </button>
                               <button
                                   onClick={handleDownload}
                                   className="py-2 px-6 font-semibold text-white bg-gray-700 rounded-lg shadow-lg hover:bg-gray-600 transform hover:scale-105 transition-all duration-300"
                               >
                                   Download Video
                                </button>
                           </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;
