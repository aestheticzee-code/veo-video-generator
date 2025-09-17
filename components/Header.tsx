
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center p-6 border-b border-gray-700">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
        VEO Video Generator
      </h1>
      <p className="text-gray-400 mt-2">
        Create stunning videos from text and images with Google's VEO model.
      </p>
    </header>
  );
};
