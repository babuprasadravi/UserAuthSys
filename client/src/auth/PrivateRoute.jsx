import React from 'react';
import {Navigate, useLocation } from 'react-router-dom';
import { isAuth } from './Helpers';

const PrivateRoute = ({ children }) => {
  let location = useLocation();
  const auth = isAuth()
  return (auth ?
      <>{children}</> : <Navigate to="/signin" state={{ from: location }} />
  )
}

export default PrivateRoute;
