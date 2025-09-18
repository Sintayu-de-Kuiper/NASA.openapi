import React, {useEffect, useContext} from 'react';
import {Link} from 'react-router-dom';
import InfiniteScroll from "react-infinite-scroll-component";
import ApodFeedContext from "../context/ApodFeedContext.tsx";

const API_KEY = import.meta.env.VITE_NASA_API_KEY;
if (!API_KEY) {
  throw new Error('VITE_NASA_API_KEY is not set in .env');
}

const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}`;
if (!API_URL) {
  throw new Error('API_URL is not defined');
}

const ITEMS_PER_BATCH = 9;

const ApodFeed: React.FC = () => {
  const context = useContext(ApodFeedContext);
  if (!context) {
    throw new Error('ApodFeed must be used within an ApodFeedProvider');
  }
  const {apods, setApods, lastDate, setLastDate, hasMore, setHasMore} = context;

  const getDateString = (date: Date): string => date.toISOString().slice(0, 10);

  const fetchBatch = async (start: string, end: string) => {
    try {
      const response = await fetch(`${API_URL}&start_date=${start}&end_date=${end}&thumbs=true`);
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
    const startDate = new Date();
    startDate.setDate(new Date().getDate() - (ITEMS_PER_BATCH - 1)); // 9 days for 9 items
    const startStr = getDateString(startDate);
    const endStr = getDateString(new Date());

    // Set newLast to the day before startDate
    const newLast = new Date(startDate);
    newLast.setDate(startDate.getDate() - 1);

    setLastDate(getDateString(newLast));
    const initialAPODs = await fetchBatch(startStr, endStr);
    setApods(initialAPODs);
    if (initialAPODs.length < ITEMS_PER_BATCH) setHasMore(false);
  };

  const fetchNext = async () => {
    if (!lastDate) return;

    const endDate = new Date(lastDate);
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (ITEMS_PER_BATCH - 1));

    const start = getDateString(startDate);
    const end = getDateString(endDate);

    const data = await fetchBatch(start, end);
    setApods((prev) => [...prev, ...data]);

    // Set newLast to the day before startDate
    const newLast = new Date(startDate);
    newLast.setDate(startDate.getDate() - 1);

    setLastDate(getDateString(newLast));
    if (data.length < ITEMS_PER_BATCH) setHasMore(false);
  };

  useEffect(() => {
    if (apods.length === 0) {
      fetchInitial();
    }
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="w-full min-h-screen h-full bg-black pt-20">
      <div className="mx-auto px-6 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold text-white mb-10">Astronomy Picture of the Day</h1>
        <InfiniteScroll
          dataLength={apods.length}
          next={fetchNext}
          hasMore={hasMore}
          loader={<h4 className="text-white text-center">Loading...</h4>}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-4">
            {apods.map((apod) => (
              <Link
                key={apod.date}
                to={`/apod/${apod.date}`}
                state={{apod}} // Pass the full APOD object
                className="border border-white/25 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <img
                  src={apod.media_type === 'video' ? apod.thumbnail_url : apod.url}
                  alt={apod.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg">{apod.title}</h3>
                  <div className="flex justify-between items-center">
                    <p
                      className="text-gray-400 text-sm">{monthNames[new Date(apod.date).getMonth()]} {new Date(apod.date).getDate()}
                      {new Date(apod.date).getFullYear() !== new Date().getFullYear() && (
                        <> {new Date(apod.date).getFullYear()}</>
                      )}</p>
                    {apod.media_type === 'video' && (<span className="material-symbols-outlined text-white/50">play_arrow</span>)}
                    {apod.media_type === 'other' && (<span title="Media type not supported" className="material-symbols-outlined text-white/50">error</span>)}
                  </div>
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