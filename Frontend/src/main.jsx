import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from 'react-router-dom'
import Login from './Component/Login.jsx'
import Register from './Component/Register.jsx'
import MainRoutes from './MainRoutes.jsx'
import Conversations from './Component/Conversations.jsx'
import Search from './Component/Search.jsx'
import Camera from './Component/Camera.jsx'
import Profile from './Component/Profile.jsx'
import UpdateDetails from './Component/UpdateDetails.jsx'
import SearchUserDetails from './Component/SearchUserDetails.jsx'
import FollowerFollowing from './Component/FollowerFollowing.jsx'
import './customcss.css'
import Chat from './Component/Chat.jsx'
import { Provider } from 'react-redux'
import store from './Component/store/store.js'
import UploadPost from './Component/UploadPost.jsx'
import SinglePost from './Component/SinglePost.jsx'
import Settings from './Component/Settings.jsx'
import ChangePassword from './Component/ChangePassword.jsx'

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
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/update" element={<UpdateDetails />} />
        <Route path="/search/:id" element={<SearchUserDetails />} />
        <Route path="/:userId/followers" element={<FollowerFollowing />} />
        <Route path="/:userId/following" element={<FollowerFollowing />} />
        <Route path="/:userId/followers/:id" element={<SearchUserDetails />} />
        <Route path="/:userId/following/:id" element={<SearchUserDetails />} />
        <Route path="/user-profile/:id" element={<SearchUserDetails />} />
        <Route path="/single-post/:id" element={<SinglePost />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/change-password" element={<ChangePassword />} />
      </Route>
      <Route path="/conversations/:id" element={<Chat />} />
      <Route path="/upload-post" element={<UploadPost />} />
    </>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store} >
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
