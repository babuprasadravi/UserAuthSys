import React from 'react';
import {Navigate, useLocation } from 'react-router-dom';
import { isAuth } from './Helpers';

const AdminRoute = ({ children }) => {
  let location = useLocation();
  const auth = isAuth() && isAuth().role === 'admin';
  return (auth ? 
      <>{children}</> : <Navigate to="/user" state={{ from: location }} />
  )
}

export default AdminRoute;