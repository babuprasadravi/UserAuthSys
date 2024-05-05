import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import Activate from "./auth/Activate";
import Forgot from "./auth/Forgot";
import Reset from "./auth/Reset";
import User from "./components/User";
import PrivateRoute from "./auth/PrivateRoute";
import Admin from "./components/Admin";
import AdminRoute from "./auth/AdminRoute";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to='/signin' />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/signin" element={<Login />} />
        <Route path="/auth/activate/:token" element={<Activate />} />
        <Route path="/user"  element={
        <PrivateRoute> <User/> </PrivateRoute>
        }/>
        <Route path="/admin" element={
        <AdminRoute> <Admin/> </AdminRoute> 
        }/>
        <Route path="/auth/password/forgot" exact element={<Forgot/>} />
        <Route path="/auth/password/reset/:token" exact element={<Reset/>}/>  
      </Routes>
    </BrowserRouter>
  );
}
