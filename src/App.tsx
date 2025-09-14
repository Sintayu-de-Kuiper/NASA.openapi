import * as React from "react";
import {Routes, Route, Link} from "react-router-dom";
import Apod from "./pages/Apod.tsx";

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <nav className="bg-blue-600 p-4">
        <ul className="flex space-x-6 text-white font-medium">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/apod" className="hover:underline">APOD</Link>
          </li>
        </ul>
      </nav>
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/apod" element={<Apod/>}/>
        </Routes>
      </main>
    </div>
  )
};

const Home: React.FC = () => (
  <div className="text-center">
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to NASA App!</h1>
    <p className="text-gray-600">Navigate to APOD to see today's astronomy picture.</p>
  </div>
);

export default App;