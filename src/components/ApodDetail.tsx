import React, {useState, useEffect} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import type {Apod} from '../types/Apod.ts';

const ApodDetail: React.FC = () => {
  const {date} = useParams<{ date: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const apod = location.state?.apod as Apod | undefined;
  const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${import.meta.env.VITE_NASA_API_KEY}&date=${date}&thumbs=true`;

  // Fallback fetch if no state (e.g., direct URL access)
  const [fallbackApod, setFallbackApod] = useState<Apod | null>(null);

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    if (!apod) {
      const fetchApod = async () => {
        try {
          const res = await fetch(API_URL);
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

  // Helper to get YouTube video ID from URL
  function getYouTubeId(url?: string): string | null {
    const match = url?.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
    );
    return match ? match[1] : null;
  }

  return (
    <div className="w-full min-h-screen h-full bg-black pt-20">
      <div className="px-6 max-w-7xl mx-auto py-8">
        <button
          onClick={() => navigate('/apod')}
          className="inline-flex items-center justify-center font-mono uppercase cursor-pointer gap-x-3 py-2 h-8 mb-4 px-4 text-white rounded-full border border-white/50 hover:bg-white/10"
        >
          Back to Feed
        </button>

        <h1 className="text-3xl font-bold text-white mb-2">{displayApod.title}</h1>
        <div className="flex items-center justify-between">
          <p className="text-white/50 mb-4">
            {displayApod.copyright && (
              <>
                {displayApod.copyright}
                {" - "}
              </>
            )}
            {monthNames[new Date(displayApod.date).getMonth()]} {new Date(displayApod.date).getDate()}
            {new Date(displayApod.date).getFullYear() !== new Date().getFullYear() && (
              <> {new Date(displayApod.date).getFullYear()}</>
            )}
          </p>

          <a
            href={displayApod.hdurl || displayApod.url}
            download={displayApod.title}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="inline-flex items-center justify-center font-mono uppercase cursor-pointer gap-x-3 py-2 h-8 mb-4 px-4 text-white rounded-full border border-white/50 hover:bg-white/10"
            >
              Download
            </button>
          </a>
        </div>

        {displayApod.media_type === 'image' ? (
          <img
            src={displayApod.hdurl || displayApod.url}
            alt={displayApod.title}
            className="w-full object-contain mb-4"
          />
        ) : getYouTubeId(displayApod.url) ? (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${getYouTubeId(displayApod.url)}`}
            title={displayApod.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="mb-4"
          />
        ) : (
          <video controls poster={displayApod.thumbnail_url} className="w-full mb-4">
            <source src={displayApod.url} type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
        )}
        <p className="text-white/50 mb-4">{displayApod.explanation}</p>
      </div>
    </div>
  );
};

export default ApodDetail;