import { useState } from "react";
import "./App.css";
import MainCard from './components/MainCard'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import DetailVideo from "./components/DetailVideo";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainCard/>} />
        <Route path="/detail-video/:id" element={<DetailVideo/>} />
      </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
