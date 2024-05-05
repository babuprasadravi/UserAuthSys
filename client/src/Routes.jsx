import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./auth/Signup";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to='/signup' />} />
        <Route path="/signup" element={<Signup />} /> 
      </Routes>
    </BrowserRouter>
  );
}
