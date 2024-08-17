import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getValidAccessToken } from './auth'
import { NavLink, useNavigate } from 'react-router-dom'
import { HiBars3 } from "react-icons/hi2";
const server = import.meta.env.VITE_SERVER

function Profile() {
  const [data, setData] = useState({
    username: '',
    fullName: '',
    profileImage: '',
    followers: [],
    following: [],
    post: [],
    bio: ''
  })
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const accessToken = await getValidAccessToken();

        const response = await axios.post('http://localhost:8000/api/v1/users/user-details', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log(response.data.data)
        const { username, fullName, followers, following, post, profileImage, bio } = response.data.data

        setData({
          username,
          fullName,
          followers,
          following,
          post,
          profileImage,
          bio
        })

      } catch (error) {
        // console.error('Error fetching user details:', error);
        navigate('/login')
      }
    };
    fetchUserDetails();

  }, [])

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  else {
    return (
      <div className='w-full mx-auto flex flex-col h-auto'>
        <div className='w-full h-10 border-b-[1px] border-gray-500 flex items-center justify-end sm:border-x-[1px]'><HiBars3 size={30} className='mr-3' /></div>
        <p className='text-xl font-semibold ml-3 my-2 xl:text-2xl'>{data.username}</p>
        <div className='flex my-3 justify-between'>
          <img src={server + data.profileImage} alt="profile image" className='w-28 ml-4 xl:w-32' />
          <div className='flex flex-col mr-5 justify-between lg:mr-10'>
            <div className='flex'>
              <div className='flex flex-col items-center mx-6 sm:mx-3 md:mx-4 xl:mx-6'>
                <span className='text-lg font-semibold'>{data.post.length}</span>
                <p className='text-lg font-semibold sm:text-base md:text-lg xl:text-xl'>Posts</p>
              </div>
              <div className='flex flex-col items-center mr-6 sm:mx-3 md:mx-4 xl:mx-6'>
                <span className='text-lg font-semibold'>{data.followers.length}</span>
                <p className='text-lg font-semibold sm:text-base md:text-lg xl:text-xl'>Followers</p>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-lg font-semibold'>{data.following.length}</span>
                <p className='text-lg font-semibold sm:text-base md:text-lg xl:text-xl'>Following</p>
              </div>
            </div>
            <NavLink to='update' className='py-1.5 w-full text-center border-[1px] border-black rounded-lg cursor-pointer sm:w-[80%] sm:mx-auto sm:py-1 md:py-1.5 md:w-full'>Edit Profile</NavLink>
          </div>
        </div>
        <div className='h-auto my-2 mx-3 w-60'>{data.bio}</div>
        <div className='w-full h-[2px] my-2 bg-black' />
        <div className='h-80 flex items-center justify-center font-semibold text-xl'>
          No Posts
        </div>
      </div>
    )
  }

}

export default Profile