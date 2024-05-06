import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuth } from './Helpers';

// Component for rendering routes accessible only to admin users
const AdminRoute = ({ children }) => {
  // Getting current location
  let location = useLocation();

  // Checking if user is authenticated and has admin role
  const auth = isAuth() && isAuth().role === 'admin';

  // Rendering either the children components or redirecting to user route if not admin
  return (
    auth ? 
    <>{children}</> : <Navigate to="/user" state={{ from: location }} />
  )
}

export default AdminRoute;
