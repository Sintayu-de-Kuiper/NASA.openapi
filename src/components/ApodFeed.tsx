import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import type {Apod} from "../types/Apod.ts";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
if (!API_KEY) {
  throw new Error('VITE_NASA_API_KEY is not set in .env');
}

const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
if (!API_URL) {
  throw new Error('API_URL is not defined');
}


const ApodFeed: React.FC = () => {
  const [apods, setApods] = useState<Apod[]>([]);
  const [lastDate, setLastDate] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const getDateString = (date: Date): string => date.toISOString().slice(0, 10);

  const fetchBatch = async (start: string, end: string) => {
    try {
      const response = await fetch(`${API_URL}&start_date=${start}&end_date=${end}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data.reverse() : [data].reverse();
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchInitial = async () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 9); // Last 10 days
    const startStr = getDateString(startDate);
    const endStr = getDateString(today);

    // Correctly calculate newLast as the day before startDate
    const newLast = new Date(startDate);
    newLast.setDate(startDate.getDate() - 1);

    setLastDate(getDateString(newLast));
    const initialAPODs = await fetchBatch(startStr, endStr);
    setApods(initialAPODs);
    if (initialAPODs.length < 10) setHasMore(false);
  };

  const fetchNext = async () => {
    if (!lastDate) return;

    const endDate = new Date(lastDate);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 9);

    const start = getDateString(startDate);
    const end = getDateString(endDate);

    const data = await fetchBatch(start, end);
    setApods((prev) => [...prev, ...data]);

    // Correctly calculate newLast as the day before startDate
    const newLast = new Date(startDate);
    newLast.setDate(startDate.getDate() - 1);

    setLastDate(getDateString(newLast));
    if (data.length < 10) setHasMore(false);
  };


  useEffect(() => {
    fetchInitial().then(r => r);
  }, []);

  return (
    <div className="relative h-full w-full">
      <div className="mx-auto my-10 p-6 max-w-7xl">
        <InfiniteScroll
          dataLength={apods.length}
          next={fetchNext}
          hasMore={hasMore}
          loader={<h4 className="text-white text-center">Loading more APODs...</h4>}
          endMessage={<p className="text-white text-center">No more APODs to load.</p>}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {apods.map((apod) => (
              <Link
                key={apod.date}
                to={`/apod/${apod.date}`}
                state={{apod}} // Pass the full APOD object
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={apod.media_type === 'video' ? apod.thumbnail_url : apod.url}
                  alt={apod.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg">{apod.title}</h3>
                  <p className="text-gray-400 text-sm">{new Date(apod.date).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default ApodFeed