import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Login from "./Login";
import AnimeRecord from "./AnimeRecord";
import ProtectedRoute from "./routes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/anime_record"} replace/>
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/anime_record",
    element: <ProtectedRoute><AnimeRecord /></ProtectedRoute>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);
