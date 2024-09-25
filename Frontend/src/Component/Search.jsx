import React, { useState, useEffect } from 'react'
import { IoSearch } from "react-icons/io5";
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const server = import.meta.env.VITE_SERVER


function Search() {
  const [searchUsername, setSearchUsername] = useState('')
  const [usersArr, setUsersArr] = useState([])

  useEffect(() => {
    const searchUser = async () => {
      try {
        const data = {
          username: searchUsername
        }
        const response = await axios.post('/api/v1/search/search-username', data)
        setUsersArr(searchUsername === '' ? [] : response.data.data)
      } catch (error) {
        setUsersArr([])
        console.error(error);
      }
    }
    searchUser()
  }, [searchUsername])

  return (
    <div className='w-full h-auto flex flex-col relative z-10'>
      <div className='w-full h-auto flex justify-center items-center'>
        <p className='w-[90%] h-auto my-2 bg-gray-100 border-[1px] gap-2 flex border-gray-400 p-2 rounded-lg'>
          <IoSearch size={25} className='text-gray-600' />
          <input type="text" name='search' value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} placeholder='Search' className='bg-gray-100 w-full outline-none' />
        </p>
      </div>
      <div className='w-full h-[1px] bg-black' />
      <div className='w-full h-auto flex flex-col p-2 gap-3 mt-2 mb-20'>
        {
          usersArr.map((user, index) => (
            <NavLink to={user._id} key={index} className='bg-gray-100 w-full h-auto flex p-2 gap-3 cursor-pointer rounded-lg active:bg-gray-200 hover:bg-gray-200'>
              <img src={user.profileImage === '/temp/default.jpg' ? server + user.profileImage : user.profileImage} alt="profile image" className='rounded-full w-14' />
              <div className='h-auto flex-1 flex flex-col md:text-lg'>
                <span>{user.username}</span>
                <span className='text-gray-700 text-base'>{user.fullName}</span>
              </div>
            </NavLink>
          ))
        }
      </div>
    </div>
  )
}

export default Search