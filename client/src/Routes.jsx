import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import Activate from "./auth/Activate";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to='/signup' />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/signin" element={<Login />} />

        <Route path="/auth/activate/:token" element={<Activate />} />
      </Routes>
    </BrowserRouter>
  );
}
