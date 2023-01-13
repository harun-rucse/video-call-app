import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Video from "./pages/Video";
import End from "./pages/End";
import { AppProvider } from "./context/AppContext";

const App = () => {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video-call" element={<Video />} />
        <Route path="/end-call" element={<End />} />
      </Routes>
    </AppProvider>
  );
};

export default App;
