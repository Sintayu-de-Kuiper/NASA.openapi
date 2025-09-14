import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type {Apod} from '../types/Apod.ts';

const ApodDetail: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const apod = location.state?.apod as Apod | undefined;

  // Fallback fetch if no state (e.g., direct URL access)
  const [fallbackApod, setFallbackApod] = useState<Apod | null>(null);

  useEffect(() => {
    if (!apod) {
      const fetchApod = async () => {
        try {
          const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}&date=${date}&thumbs=true`);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          const data = await res.json();
          setFallbackApod(data);
        } catch (error) {
          console.error('Error fetching APOD:', error);
        }
      };
      fetchApod().then(r => r);
    }
  }, [date, apod]);

  const displayApod = apod || fallbackApod;

  if (!displayApod) {
    return <div className="text-white text-center p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to Feed
      </button>
      <h1 className="text-3xl font-bold text-white mb-2">{displayApod.title}</h1>
      <p className="text-gray-400 mb-4">{new Date(displayApod.date).toLocaleDateString()}</p>
      {displayApod.media_type === 'image' ? (
        <img
          src={displayApod.hdurl || displayApod.url}
          alt={displayApod.title}
          className="w-full max-h-[80vh] object-contain mb-4"
        />
      ) : (
        <video controls poster={displayApod.thumbnail_url} className="w-full mb-4">
          <source src={displayApod.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <p className="text-white mb-4">{displayApod.explanation}</p>
      <a
        href={displayApod.hdurl || displayApod.url}
        download
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Download
      </a>
    </div>
  );
};

export default ApodDetail;