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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Route>
      {/* <Route path='/chat' element={<MainRoutes />}>
        <Route path='/chat' element={<Chat />} />
        <Route path='/search' element={<Search />} />
        <Route path='/camera' element={<Camera />} />
        <Route path='/profile' element={<Profile />} />
      </Route> */}
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
