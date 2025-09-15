// Updated ApodFeedContext.tsx
import React, { createContext, type ReactNode, useState, type Dispatch, type SetStateAction } from 'react';
import type { Apod } from '../types/Apod.ts';

interface ApodFeedContextType {
  apods: Apod[];
  setApods: Dispatch<SetStateAction<Apod[]>>;
  lastDate: string | null;
  setLastDate: Dispatch<SetStateAction<string | null>>;
  hasMore: boolean;
  setHasMore: Dispatch<SetStateAction<boolean>>;
}

const ApodFeedContext = createContext<ApodFeedContextType | undefined>(undefined);

export const ApodFeedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apods, setApods] = useState<Apod[]>([]);
  const [lastDate, setLastDate] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  return (
    <ApodFeedContext.Provider value={{ apods, setApods, lastDate, setLastDate, hasMore, setHasMore }}>
      {children}
    </ApodFeedContext.Provider>
  );
};

export default ApodFeedContext;