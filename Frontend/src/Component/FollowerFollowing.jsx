import React, { useEffect, useState } from 'react'
import { BsArrowLeft } from "react-icons/bs";
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const server = import.meta.env.VITE_SERVER


function FollowerFollowing() {
    const [data, setData] = useState({
        username: '',
        followers: [],
        following: []
    })
    const [followersList, setFollowersList] = useState([])
    const [followingList, setFollowingList] = useState([])
    const [currentUser, setCurrentUser] = useState('')
    const [followToggle, setFollowToggle] = useState(false)
    const location = useLocation();
    const [activeContainer, setActiveContainer] = useState(location.pathname.search("followers") >= 5 ? "followers" : "following");

    const { userId } = useParams()
    const navigate = useNavigate()

    const handleButtonClick = (container) => {
        setActiveContainer(container);
    };

    function handleBack() {
        navigate(-1)
    }

    async function handleFollow(id) {
        try {
            const details = {
                searchedUserId: id
            }
            const response = await axios.post('/api/v1/search/follow-user', details)
            if (response.data.statusCode == 200) {
                setFollowToggle(!followToggle)
            }
        } catch (error) {
            console.log('Failed to follow the user', error);
        }
    }

    useEffect(() => {
        if (location.pathname.search("followers") >= 5) {
            setActiveContainer("followers")
        } else if (location.pathname.search("followers") === -1) {
            setActiveContainer("following")
        }
        async function fetchUserDetails() {
            try {
                const details = { id: userId }
                const response = await axios.post('/api/v1/users-details/user-details-followers-following', details)
                const { username, followers, following } = response.data.data
                setData({ username, followers, following })
                const userIdLocal = JSON.parse(localStorage.getItem('userId'))
                setCurrentUser(userIdLocal)
            } catch (error) {
                console.log("Error while fetching user data :", error)
            }
        }
        fetchUserDetails()
    }, [userId, location.pathname]);

    useEffect(() => {
        if (activeContainer && (data.followers.length > 0 || data.following.length > 0)) {
            async function fetchFollowersFollowingDetails() {
                try {
                    const dataArr = {
                        id: activeContainer === 'followers' ? data.followers : data.following
                    }
                    const response = await axios.post('/api/v1/users-details/followers-followings-details', dataArr)
                    if (activeContainer === "followers") setFollowersList(response.data.data)
                    else setFollowingList(response.data.data)
                } catch (error) {
                    console.log("Error while fetching followers data :", error)
                }
            }
            fetchFollowersFollowingDetails();
        }
    }, [activeContainer, data]);

    return (
        <div className='w-full h-auto flex flex-col overflow-hidden'>
            <div className='w-full h-auto flex sm:border-x-[1px] border-b-[1px] border-black py-2 items-center'>
                <BsArrowLeft size={25} className='ml-3 sm:size-8 cursor-pointer' onClick={handleBack} />
                <span className='text-black font-semibold ml-6 text-lg md:text-xl'>{data.username}</span>
            </div>
            <div className='w-full h-auto flex'>
                <p onClick={() => handleButtonClick('followers')} className='w-[50%] h-10 flex items-center justify-center cursor-pointer active:bg-gray-100 md:hover:bg-gray-100'>{data.followers.length} Followers</p>
                <p onClick={() => handleButtonClick('following')} className='w-[50%] h-10 flex items-center justify-center cursor-pointer active:bg-gray-100 md:hover:bg-gray-100'>{data.following.length} Following</p>
            </div>
            <div className={`${activeContainer === 'followers' ? 'translate-x-0' : 'translate-x-[50%]'} w-full h-auto flex transition duration-300`}>
                <p className='w-[50%] h-[2px] bg-black'></p>
            </div>
            <div className='relative w-full h-[80vh] overflow-hidden'>
                <div
                    className={`absolute top-0 w-full h-full flex flex-col transition-transform duration-500 ease-in-out mb-20 ${activeContainer === 'followers' ? 'transform translate-x-0' : 'transform -translate-x-full'
                        }`}
                >
                    {
                        followersList.map((follower, index) => (
                            <NavLink to={`/${userId}/followers/${follower._id}`} key={index} className='w-full h-auto flex p-2 my-2 gap-3 cursor-pointer rounded-lg active:bg-gray-200 md:hover:bg-gray-200'>
                                <img src={follower.profileImage === '/temp/default.jpg' ? server + follower.profileImage : follower.profileImage} alt="profile image" className='rounded-full w-14 lg:w-16' />
                                <div className='h-auto flex-1 flex flex-col md:text-lg'>
                                    <span className='font-semibold'>{follower.username}</span>
                                    <span className='text-gray-700 text-sm md:text-base'>{follower.fullName}</span>
                                </div>
                                {
                                    follower.isFollowing
                                        ? <div className='w-auto h-auto flex items-center justify-center text-sm mr-2 lg:text-base lg:mr-4'>
                                            <span className='px-2.5 py-1 text-center border-[1px] border-blue-500 text-blue-500 rounded-lg cursor-pointer transition duration-200 ease-in-out transform hover:bg-blue-500 hover:text-white hover:shadow-lg active:bg-blue-600 lg:py-0.5 lg:px-4'>Message</span>
                                        </div>
                                        : <div className={`${follower._id === currentUser ? 'hidden' : 'w-auto h-auto flex items-center justify-center text-sm mr-2 lg:text-base lg:mr-4' } `} >
                                            <span onClick={() => handleFollow(follower._id)} className='px-2.5 py-1 text-center border-[1px] border-blue-500 text-blue-500 rounded-lg cursor-pointer transition duration-200 ease-in-out transform hover:bg-blue-500 hover:text-white hover:shadow-lg active:bg-blue-600 lg:py-0.5 lg:px-4'>Follows</span>
                                        </div>
                                }
                            </NavLink>
                        ))
                    }
                </div>
                <div
                    className={`absolute top-0 w-full h-full flex flex-col transition-transform duration-500 ease-in-out mb-20 ${activeContainer === 'following' ? 'transform translate-x-0' : 'transform translate-x-full'
                        }`}
                >
                    {
                        followingList.map((following, index) => (
                            <NavLink to={`/${userId}/following/${following._id}`} key={index} className='w-full h-auto flex p-2 my-2 gap-3 cursor-pointer rounded-lg active:bg-gray-200 md:hover:bg-gray-200'>
                                <img src={following.profileImage === '/temp/default.jpg' ? server + following.profileImage : following.profileImage} alt="profile image" className='rounded-full w-14 lg:w-16' />
                                <div className='h-auto flex-1 flex flex-col md:text-lg'>
                                    <span className='font-semibold'>{following.username}</span>
                                    <span className='text-gray-700 text-sm md:text-base'>{following.fullName}</span>
                                </div>
                                {
                                    following.isFollowing
                                        ? <div className='w-auto h-auto flex items-center justify-center text-sm mr-2 lg:text-base lg:mr-4'>
                                            <span className='px-2.5 py-1 text-center border-[1px] border-blue-500 text-blue-500 rounded-lg cursor-pointer transition duration-200 ease-in-out transform hover:bg-blue-500 hover:text-white hover:shadow-lg active:bg-blue-600 lg:py-0.5 lg:px-4'>Message</span>
                                        </div>
                                        : <div className={`${following._id === currentUser ? 'hidden' : 'w-auto h-auto flex items-center justify-center text-sm mr-2 lg:text-base lg:mr-4' } `}>
                                            <span onClick={() => handleFollow(following._id)} className='px-2.5 py-1 text-center border-[1px] border-blue-500 text-blue-500 rounded-lg cursor-pointer transition duration-200 ease-in-out transform hover:bg-blue-500 hover:text-white hover:shadow-lg active:bg-blue-600 lg:py-0.5 lg:px-4'>Follows</span>
                                        </div>
                                }
                            </NavLink>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default FollowerFollowing