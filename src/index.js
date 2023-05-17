import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import Login from "./Login";
import AnimeRecord from "./AnimeRecord";
import ProtectedRoute from "./routes/ProtectedRoute";
import store from "./store";
import {Provider} from "react-redux";
import Welcome from "./Welcome";

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
  },
  {
    path: "/welcome",
    element: <Welcome />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <LiveSearch  />
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
    // <React.StrictMode>
    //   <RouterProvider router={router} />
    // </React.StrictMode>
);
