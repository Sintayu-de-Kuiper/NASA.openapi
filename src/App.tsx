import * as React from "react";
import {Routes, Route} from "react-router-dom";
import Apod from "./components/ApodFeed.tsx";
import ApodDetail from "./components/ApodDetail.tsx";
import Header from "./components/Header.tsx";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Header/>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/apod" element={<Apod/>}/>
          <Route path="/apod/:date" element={<ApodDetail/>}/>
        </Routes>
      </main>
    </div>
  )
};

const Home: React.FC = () => (
  <div className="text-center mt-20">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to NASA App!</h1>
    <p className="text-gray-600">Navigate to APOD to see today's astronomy picture.</p>
  </div>
);

export default App;