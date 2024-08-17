import React, { useState } from 'react'
import { useEffect } from 'react'
import { getValidAccessToken } from './auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const server = import.meta.env.VITE_SERVER

function UpdateDetails() {
    const [data, setData] = useState({
        fullName: '',
        email: '',
        bio: '',
        profileImage: '',
        createdAt: ''
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
                const { email, fullName, bio, profileImage, createdAt } = response.data.data
                const dateObj = new Date(createdAt);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;
                setData({
                    email,
                    fullName,
                    bio,
                    profileImage,
                    createdAt:formattedDate
                })

            } catch (error) {
                // console.error('Error fetching user details:', error);
                navigate('/login')
            }
        };
        fetchUserDetails();
    }, [])

    // console.log(data);

    if (!user) null
    else {
        return (
            <div className='flex flex-col'>
                <div className='w-full h-auto flex justify-center items-center'>
                    <img src={server + data.profileImage} alt="Profile Image" className='w-32' />
                </div>
                <p className='w-full h-auto my-3 text-center'>Account created at : {data.createdAt}</p>
                <div className='w-full h-auto my-5 px-4 flex flex-col'>
                    <span className='text-lg font-semibold'>FullName</span>
                    <input type="text" value={data.fullName} placeholder='Fullname' className='border-[1px] border-gray-500 my-3 h-10 px-3 bg-gray-100 rounded-md'/>
                </div>
            </div>
        )
    }

}

export default UpdateDetails