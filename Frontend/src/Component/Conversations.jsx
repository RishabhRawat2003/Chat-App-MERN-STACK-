import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

const server = import.meta.env.VITE_SERVER


function Conversations() {
  const [chattingToUser, setChattingToUser] = useState([])
  const [username, setUsername] = useState('')

  useEffect(() => {
    async function loggedInUserDetails() {
      try {
        const response = await axios.post('/api/v1/users/user-details', {});
        const { username } = response.data.data
        setUsername(username)
      } catch (error) {
        console.error('error while fetching details of logged in user', error);
      }
    }
    async function getAllConversations() {
      try {
        const response = await axios.post('/api/v1/message/all-conversations');
        if (response.data.statusCode === 200) setChattingToUser(response.data.data)

      } catch (error) {
        console.log("Error occured while fetching all coversations", error)
      }
    }
    loggedInUserDetails()
    getAllConversations()
  }, [])

  return (
    <div className='w-full h-[90%] flex flex-col gap-2'>
      <div className='w-full h-auto p-2 px-5 text-lg border-black border-b-2 font-semibold md:text-2xl md:p-3 md:px-6'>{username}</div>
      <div className='w-full h-auto flex flex-col gap-5 p-2'>
        {
          chattingToUser.map((user, index) => (
            <NavLink to={'/conversations/' + user._id} key={index} className='w-full h-20 rounded-lg cursor-pointer shadow-md flex p-2 md:hover:bg-gray-100 active:bg-gray-100 gap-5'>
              <img src={user.profileImage === '/temp/default.jpg' ? server + user.profileImage : user.profileImage} alt="profile image" className='rounded-full border-[1px] border-gray-500' />
              <div className='flex-1 h-full flex flex-col'>
                <span className='font-semibold'>{user.username}</span>
                <span className='text-gray-500 font-bold'>New Messages</span>
              </div>
            </NavLink>
          ))
        }
      </div>
    </div>
  )
}

export default Conversations