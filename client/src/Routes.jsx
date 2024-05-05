import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to='/signup' />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/signin" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
