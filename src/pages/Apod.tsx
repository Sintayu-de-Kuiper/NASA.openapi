import React, { useState, useEffect } from 'react';

// TypeScript interface for APOD response (partial; extend as needed)
interface APODData {
  copyright?: string; // Author/photographer
  date: string;
  explanation: string;
  hdurl?: string; // High-res image URL (preferred for images)
  media_type: 'image' | 'video' | 'other';
  service_version: string;
  title: string;
  url: string; // Fallback image/video URL
}

const APOD: React.FC = () => {
  const [apodData, setApodData] = useState<APODData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use Vite's env vars for the API key (prefix with VITE_)
  const API_KEY = import.meta.env.VITE_NASA_API_KEY;
  if (!API_KEY) {
    throw new Error('VITE_NASA_API_KEY is not set in .env');
  }

  const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=2025-09-13`; // Today's date

  useEffect(() => {
    const fetchAPOD = async (): Promise<void> => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: APODData = await response.json();
        setApodData(data);
        console.log('APOD Data:', data); // Log for now: Check browser console
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAPOD();
  }, []); // Empty deps: Fetch once on mount

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Loading APOD for September 13, 2025...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        <h1 className="text-2xl font-bold mb-2">Error Loading APOD</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Astronomy Picture of the Day</h1>
      {/* Placeholder: We'll render title, author (copyright), and image here later */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600">Data fetched successfully for {apodData?.date}!</p>
        <p className="mt-2 text-sm">Check console for full details (title: {apodData?.title}, author: {apodData?.copyright}).</p>
      </div>
    </div>
  );
};

export default APOD;