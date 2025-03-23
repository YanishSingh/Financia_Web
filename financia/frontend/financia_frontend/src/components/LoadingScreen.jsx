// src/components/LoadingScreen.jsx
import React from 'react';
import logo from '../assets/Logo/Financia.png'; // Adjust the path based on your project structure

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="flex flex-col items-center">
        {/* Logo Image with animation */}
        <img
          src={logo}
          alt="Financia Logo"
          className="w-32 h-32" // Custom animation below
        />
        {/* Logo Text */}
        <h1
          className="mt-4 text-5xl text-white font-bold animate-bounce tracking-wide"
          style={{ fontFamily: 'Moonet, sans-serif' }}
        >
          Financia
        </h1>
      </div>
    </div>
  );
};

export default LoadingScreen;
