import * as React from "react";
import {Routes, Route} from "react-router-dom";
import Apod from "./components/ApodFeed.tsx";
import ApodDetail from "./components/ApodDetail.tsx";
import Header from "./components/Header.tsx";
import {ApodFeedProvider} from './context/ApodFeedContext.tsx';

const App: React.FC = () => {
  return (
    <div>
      <Header/>
      <main>
        <ApodFeedProvider>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/apod" element={<Apod/>}/>
            <Route path="/apod/:date" element={<ApodDetail/>}/>
          </Routes>
        </ApodFeedProvider>
      </main>
    </div>
  )
};

const Home: React.FC = () => (
  <div className="w-full min-h-screen h-full bg-black pt-20">
    <div className="mx-auto px-6 py-8 max-w-7xl">
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold text-white mb-4">Welcome to the NASA open API interface!</h1>
        <p className="text-gray-600">Navigate to APOD to see today's astronomy picture.</p>
      </div>
    </div>
  </div>
);

export default App;