import React from 'react';
import {Navigate} from "react-router-dom";

function ProtectedRoute({ children }) {

  function hasJWT() {
    return !!localStorage.getItem('token');
  }

  if (!hasJWT()) {
    return <Navigate to="/login" replace/>;
  } else {
    return children;
  }
}

export default ProtectedRoute;