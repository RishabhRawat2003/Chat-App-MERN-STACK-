import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'
import { HiBars3 } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { IoMoonOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { FaBug } from "react-icons/fa";

const server = import.meta.env.VITE_SERVER

function Profile() {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [themeToggle, setThemeToggle] = useState(false)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [logoutPopUp, setLogoutPopUp] = useState(false)
  const [data, setData] = useState({
    username: '',
    fullName: '',
    profileImage: '',
    followers: [],
    following: [],
    post: [],
    bio: '',
    id: ""
  })
  const navigate = useNavigate()

  async function logoutHandle() {
    try {
      await axios.post('/api/v1/users/logout', {});
      setUserLoggedIn(false)
      setTimeout(() => {
        navigate('/login')

      }, 1000);
    } catch (error) {
      console.log("Error while logging out : ", error);
    }
  }

  useEffect(() => {
    const fetchUserDetails = async () => {

      try {
        const response = await axios.post('/api/v1/users/user-details', {});
        const { username, fullName, followers, following, post, profileImage, bio, _id } = response.data.data
        setData({
          username,
          fullName,
          followers,
          following,
          post,
          profileImage,
          bio,
          id: _id
        })
        setUserLoggedIn(true)
      } catch (error) {
        console.error('Error fetching user details:', error);
        navigate('/login')
      }
    };
    fetchUserDetails();

  }, [])


  const bioLines = data.bio.trim().split('\n');

  if (!userLoggedIn) {
    return (<div className="flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>)
  } else {
    return (
      <div className='w-full mx-auto flex flex-col h-auto relative z-10 overflow-x-hidden'>
        <div className='w-full py-2 border-b-[1px] border-gray-500 flex items-center justify-between sm:border-x-[1px]'><span className='mx-5'>Logo</span><HiBars3 size={30} className='mx-3 cursor-pointer' onClick={() => setToggleSidebar(true)} /></div>
        <div className={`${toggleSidebar ? 'translate-x-[40vw] md:duration-500 2xl:duration-700 sm:translate-x-[27vw] md:translate-x-[28vw] lg:translate-x-[25vw] xl:translate-x-[27.4vw] 2xl:translate-x-[24vw]' : 'translate-x-[100vw] md:duration-500 2xl:duration-700 sm:translate-x-[60vw] lg:translate-x-[50vw] xl:translate-x-[45vw] 2xl:translate-x-[40vw]'} rounded-l-xl transition ease-in-out duration-300 flex flex-col absolute z-30 h-full w-[60%] bg-gray-50 sm:w-[55%] lg:w-[50%] xl:w-[40%] 2xl:w-[40%]`}>
          <div className='w-full h-auto border-b-2 border-gray-600 flex items-center justify-between py-2'>
            <span className='mx-5 text-xs md:text-sm font-semibold'>Settings & Activity</span>
            <IoCloseOutline size={30} className='cursor-pointer mx-4' onClick={() => setToggleSidebar(false)} />
          </div>
          <div className='flex flex-col w-full h-auto gap-4 px-2 my-4'>
            <div className='group flex gap-2 items-center cursor-pointer p-2 rounded-lg active:bg-indigo-500 md:hover:bg-indigo-500 active:shadow-lg md:hover:shadow-lg'>
              <IoMdSettings size={25} className='md:group-hover:text-white group-active:text-white md:size-8' />
              <span className='text-lg font-semibold md:group-hover:text-white group-active:text-white'>Settings</span>
            </div>
            <div className='group flex gap-2 items-center cursor-pointer p-2 rounded-lg active:bg-indigo-500 md:hover:bg-indigo-500 active:shadow-lg md:hover:shadow-lg'>
              <IoNotificationsOutline size={25} className='md:group-hover:text-white group-active:text-white md:size-8' />
              <span className='text-lg font-semibold md:group-hover:text-white group-active:text-white'>Notifications</span>
            </div>
            <div className='group flex gap-2 items-center cursor-pointer p-2 rounded-lg active:bg-indigo-500 md:hover:bg-indigo-500 active:shadow-lg md:hover:shadow-lg'>
              <FaBug size={25} className='md:group-hover:text-white group-active:text-white md:size-8' />
              <span className='text-lg font-semibold md:group-hover:text-white group-active:text-white'>Report a bug</span>
            </div>
          </div>
          <div className='h-[1px] w-full bg-gray-500' />
          <div className='flex flex-col w-full h-auto gap-4 px-2 my-4'>
            <div className='group flex gap-2 items-center cursor-pointer p-2 rounded-lg active:bg-indigo-500 md:hover:bg-indigo-500 active:shadow-lg md:hover:shadow-lg'>
              {themeToggle ? <IoSunnyOutline size={25} className='md:group-hover:text-white group-active:text-white' /> : <IoMoonOutline size={25} className='md:group-hover:text-white group-active:text-white' />}
              <div className='text-lg font-semibold flex flex-grow justify-between items-center md:group-hover:text-white group-active:text-white'>{themeToggle ? <span>Lightmode</span> : <span>Darkmode</span>}
                <span onClick={() => setThemeToggle(!themeToggle)} className='h-6 w-12 md:h-6.5 md:w-14 p-0.5 rounded-full border-2 flex items-center border-gray-200 bg-gray-200 mr-2'>
                  <p className={themeToggle ? 'rounded-full bg-gray-600 h-4 w-4 md:h-5 md:w-5 translate-x-6 md:translate-x-7 duration-200 transition ease-in-out' : 'rounded-full bg-white h-4 w-4 md:h-5 md:w-5 translate-x-0 duration-200 transition ease-in-out'} ></p>
                </span>
              </div>
            </div>
            <div onClick={() => setLogoutPopUp(true)} className='group flex gap-2 items-center cursor-pointer p-2 rounded-lg active:bg-indigo-500 md:hover:bg-indigo-500 active:shadow-lg md:hover:shadow-lg'>
              <BiLogOut size={25} className='md:group-hover:text-white group-active:text-white md:size-8' />
              <span className='text-lg font-semibold group-hover:text-white'>Logout</span>
            </div>
          </div>
        </div>
        {logoutPopUp && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
              <div className='w-full h-auto flex justify-center items-center mb-3'>
                <span className='p-4 rounded-full bg-red-100'>
                  <BiLogOut size={30} className='text-red-500 rotate-[180deg]' />
                </span>
              </div>
              <h2 className="text-lg font-semibold mb-1">Logout</h2>
              <h2 className="text-base font-medium text-gray-500 mb-6">Are you sure you want to logout?</h2>
              <div onClick={logoutHandle} className='w-full h-auto bg-red-600 font-medium text-center text-white rounded-lg py-2 mb-4 cursor-pointer active:bg-red-700 hover:bg-red-700'>Yes, logout</div>
              <div onClick={() => setLogoutPopUp(false)} className='w-full h-auto bg-gray-100 font-medium text-center text-black rounded-lg py-2 cursor-pointer active:bg-gray-200 hover:bg-gray-200'>Cancel</div>
            </div>
          </div>
        )}
        <p className='text-xl font-semibold ml-3 my-2 xl:text-2xl'>{data.username}</p>
        <div className='flex my-3 justify-between'>
          <img src={data.profileImage === '/temp/default.jpg' ? server + data.profileImage : data.profileImage} alt="profile image" className='w-20 h-20 ml-4 sm:h-24 sm:w-24 md:h-28 md:w-28 xl:h-32 xl:w-32 rounded-full border-2' />
          <div className='flex flex-col gap-4 mr-2 sm:mr-5 justify-between lg:mr-10'>
            <div className='flex'>
              <div className='flex flex-col items-center mx-6 sm:mx-3 md:mx-4 xl:mx-6'>
                <span className='text-sm font-medium sm:text-base md:text-lg sm:font-semibold'>{data.post.length}</span>
                <p className='sm:font-semibold md:text-base lg:text-lg xl:text-xl'>Posts</p>
              </div>
              <NavLink to={data.id + '/followers'} className='flex flex-col items-center mr-6 sm:mx-3 md:mx-4 xl:mx-6 cursor-pointer md:hover:bg-gray-50 active:bg-gray-50'>
                <span className='text-sm font-medium sm:text-base md:text-lg sm:font-semibold'>{data.followers.length}</span>
                <p className='sm:font-semibold md:text-base lg:text-lg xl:text-xl'>Followers</p>
              </NavLink>
              <NavLink to={data.id + '/following'} className='flex flex-col items-center cursor-pointer md:hover:bg-gray-50 active:bg-gray-50'>
                <span className='text-sm font-medium sm:text-base md:text-lg sm:font-semibold'>{data.following.length}</span>
                <p className='sm:font-semibold md:text-base lg:text-lg xl:text-xl'>Following</p>
              </NavLink>
            </div>
            <NavLink to='update' className='w-[85%] mx-auto py-0.5 sm:py-1 sm:w-full text-center border-[1px] border-blue-500 text-blue-500 rounded-lg cursor-pointer transition duration-200 ease-in-out transform hover:bg-blue-500 hover:text-white hover:shadow-lg active:bg-blue-600 md:py-1.5 sm:mx-auto lg:w-full'>
              Edit Profile
            </NavLink>
          </div>
        </div>
        <div className='h-auto my-2 mx-3 w-64'>
          {bioLines.map((line, index) => (
            <p key={index} className='text-sm md:text-base'>
              {line}
            </p>
          ))}
        </div>
        <div className='w-full h-[2px] my-2 bg-black' />
        <div className='h-80 flex items-center justify-center font-semibold text-xl'>
          No Posts
        </div>
      </div>
    )
  }

}

export default Profile