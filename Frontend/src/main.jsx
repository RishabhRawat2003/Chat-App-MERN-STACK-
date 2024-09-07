import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Login from './Component/Login.jsx'
import Register from './Component/Register.jsx'
import MainRoutes from './MainRoutes.jsx'
import Chat from './Component/Chat.jsx'
import Search from './Component/Search.jsx'
import Camera from './Component/Camera.jsx'
import Profile from './Component/Profile.jsx'
import UpdateDetails from './Component/UpdateDetails.jsx'
import SearchUserDetails from './Component/SearchUserDetails.jsx'
import FollowerFollowing from './Component/FollowerFollowing.jsx'
import './customcss.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<App />} >
        <Route path="/login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="/" element={<MainRoutes />} >
        <Route path="/" element={<Profile />} />
        <Route path="/camera" element={<Camera />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/update" element={<UpdateDetails />} />
        <Route path="/search/:id" element={<SearchUserDetails />} />
        <Route path="/:id/followers" element={<FollowerFollowing />} />
        <Route path="/:id/following" element={<FollowerFollowing />} />
        <Route path="/:id/followers/:id" element={<SearchUserDetails />} />
        <Route path="/:id/following/:id" element={<SearchUserDetails />} />
      </Route>
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
