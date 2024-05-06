import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuth } from './Helpers';

// Component for rendering routes accessible only to authenticated users
const PrivateRoute = ({ children }) => {
  // Getting current location
  let location = useLocation();

  // Checking if user is authenticated
  const auth = isAuth();

  // Rendering either the children components or redirecting to signin route if not authenticated
  return (
    auth ?
    <>{children}</> : <Navigate to="/signin" state={{ from: location }} />
  )
}

export default PrivateRoute;
