
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                resolve(''); // Should not happen with readAsDataURL
            }
        };
        reader.readAsDataURL(file);
    });
    return {
        imageBytes: await base64EncodedDataPromise,
        mimeType: file.type,
    };
};


export const generateVideo = async (
    prompt: string, 
    imageFile: File | null, 
    aspectRatio: string,
    onStatusUpdate: (status: string) => void
): Promise<string> => {
    onStatusUpdate("Initializing video generation...");

    const generateVideoParams: any = {
        model: 'veo-2.0-generate-001',
        prompt,
        config: { 
            numberOfVideos: 1,
            aspectRatio: aspectRatio
        }
    };

    if (imageFile) {
        onStatusUpdate("Processing uploaded image...");
        generateVideoParams.image = await fileToGenerativePart(imageFile);
    }

    try {
        onStatusUpdate("Sending request to the model. This may take a moment...");
        let operation = await ai.models.generateVideos(generateVideoParams);
        
        onStatusUpdate("Video generation is in progress. This process can take several minutes. Please wait...");
        
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            onStatusUpdate("Checking generation status... still working on it.");
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        onStatusUpdate("Finalizing video...");
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Video generation failed: No download link found.");
        }

        onStatusUpdate("Downloading generated video...");
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`Failed to download video: ${response.statusText}`);
        }
        
        const videoBlob = await response.blob();
        onStatusUpdate("Video ready!");
        return URL.createObjectURL(videoBlob);

    } catch (error) {
        console.error("Error generating video:", error);
        if (error instanceof Error) {
            throw new Error(`Video generation failed: ${error.message}`);
        }
        throw new Error("An unknown error occurred during video generation.");
    }
};
