
import React from 'react';
import type { ImageFile } from '../types';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  image: ImageFile | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
}

const ImagePreview: React.FC<{ image: ImageFile; onRemove: () => void }> = ({ image, onRemove }) => (
  <div className="mt-4 relative group w-48 mx-auto">
    <img src={image.dataUrl} alt="Preview" className="rounded-lg w-full h-auto object-cover" />
    <button
      onClick={onRemove}
      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-700"
      aria-label="Remove image"
    >
      &times;
    </button>
  </div>
);

const AspectRatioSelector: React.FC<{
    aspectRatio: string;
    setAspectRatio: (ratio: string) => void;
    isLoading: boolean;
}> = ({ aspectRatio, setAspectRatio, isLoading }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
            Aspect Ratio
        </label>
        <div className="flex justify-center space-x-3">
            {['16:9', '1:1', '9:16'].map((ratio) => (
                <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                        aspectRatio === ratio
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {ratio}
                </button>
            ))}
        </div>
    </div>
);


export const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  setPrompt,
  image,
  handleImageChange,
  removeImage,
  handleSubmit,
  isLoading,
  aspectRatio,
  setAspectRatio,
}) => {
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Enter your video prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A majestic lion roaring on a rocky outcrop at sunset"
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-300 min-h-[100px]"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-center w-full">
        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors duration-300">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
            </svg>
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload an image</span> (optional)</p>
            <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
          </div>
          <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} disabled={isLoading} />
        </label>
      </div>

      {image && <ImagePreview image={image} onRemove={removeImage} />}

      <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} isLoading={isLoading} />

      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="w-full py-3 px-6 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
      >
        {isLoading ? 'Generating...' : 'Generate Video'}
      </button>
    </form>
  );
};
