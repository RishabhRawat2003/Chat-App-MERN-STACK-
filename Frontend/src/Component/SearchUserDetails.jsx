import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { HiBars3 } from "react-icons/hi2";
import axios from 'axios'
import { NavLink } from 'react-router-dom';
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

const server = import.meta.env.VITE_SERVER

function SearchUserDetails() {
    const [followToggle, setFollowToggle] = useState(false)
    const [posts, setPosts] = useState([])
    const [data, setData] = useState({
        username: '',
        fullName: '',
        profileImage: '',
        followers: [],
        following: [],
        post: [],
        bio: '',
        isFollowing: '',
        id: ''
    })
    const { id } = useParams()
    const navigate = useNavigate()

    async function handleFollow() {
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

    async function handleUnFollow() {
        try {
            const details = {
                searchedUserId: id
            }
            const response = await axios.post('/api/v1/search/unfollow-user', details)
            if (response.data.statusCode == 200) {
                setFollowToggle(!followToggle)
            }
        } catch (error) {
            console.log('Failed to unfollow the user', error);
        }
    }

    function handleBack() {
        navigate(-1)
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const details = {
                    searchedUserId: id
                }
                const response = await axios.post('/api/v1/search/searched-user-details', details);
                const { username, fullName, followers, following, post, profileImage, bio, isFollowing, _id } = response.data.data
                setData({
                    username,
                    fullName,
                    followers,
                    following,
                    post,
                    profileImage,
                    bio,
                    isFollowing,
                    id: _id
                })
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
        const fetchPosts = async () => {
            try {
                const data = {
                    userId: id
                }
                const response = await axios.post('/api/v1/posts/all-posts', data);
                const post = response.data.data
                setPosts(post)
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
        fetchPosts()

    }, [followToggle])

    const bioLines = data.bio.trim().split('\n');

    return (
        <div className='w-full mx-auto flex flex-col h-auto relative z-10 overflow-x-hidden'>
            <div className='w-full py-2 border-b-[1px] border-gray-500 flex items-center justify-between sm:border-x-[1px]'>
                <BsArrowLeft size={25} className='ml-3 sm:size-8 cursor-pointer' onClick={handleBack} />
                <HiBars3 size={30} className='mx-3 cursor-pointer' /></div>
            <p className='text-xl font-semibold ml-3 my-2 xl:text-2xl'>{data.username}</p>
            <div className='flex my-3 justify-between'>
                <img src={data.profileImage === '/temp/default.jpg' ? server + data.profileImage : data.profileImage} alt="profile image" className='w-20 h-20 ml-4 sm:h-24 sm:w-24 md:h-28 md:w-28 xl:h-32 xl:w-32 rounded-full border-2' />
                <div className='flex flex-col gap-4 mr-2 sm:mr-5 justify-between lg:mr-10'>
                    <div className='flex'>
                        <div className='flex flex-col items-center mx-6 sm:mx-3 md:mx-4 xl:mx-6'>
                            <span className='text-sm font-medium sm:text-base md:text-lg sm:font-semibold'>{data.post.length}</span>
                            <p className='sm:font-semibold md:text-base lg:text-lg xl:text-xl'>Posts</p>
                        </div>
                        <NavLink to={`/${id}/followers`} className='flex flex-col items-center mr-6 sm:mx-3 md:mx-4 xl:mx-6'>
                            <span className='text-sm font-medium sm:text-base md:text-lg sm:font-semibold'>{data.followers.length}</span>
                            <p className='sm:font-semibold md:text-base lg:text-lg xl:text-xl'>Followers</p>
                        </NavLink>
                        <NavLink to={`/${id}/following`} className='flex flex-col items-center'>
                            <span className='text-sm font-medium sm:text-base md:text-lg sm:font-semibold'>{data.following.length}</span>
                            <p className='sm:font-semibold md:text-base lg:text-lg xl:text-xl'>Following</p>
                        </NavLink>
                    </div>
                    {
                        data.isFollowing
                            ? <div className='w-full h-7 ease-in-out transform sm:w-[80%] sm:mx-auto md:w-full flex items-center justify-around'>
                                <p onClick={handleUnFollow} className='w-[45%] h-full text-center border-[1px] border-blue-500 text-blue-500 rounded-md cursor-pointer transition duration-200 ease-in-out transform hover:bg-blue-500 hover:text-white hover:shadow-lg active:bg-blue-600'>Unfollow</p>
                                <NavLink to={"/conversations/" + id} className="w-[45%] h-full text-center border border-gray-300 rounded-md cursor-pointer font-semibold bg-gray-100 text-gray-700 transition duration-200 ease-in-out md:hover:bg-blue-500 md:hover:text-white md:hover:border-blue-500 md:hover:shadow-md active:shadow-md active:text-white active:border-blue-500 active:bg-blue-600">Message</NavLink>
                            </div>
                            : <p onClick={handleFollow} className='w-[85%] mx-auto py-0.5 sm:py-1 sm:w-full text-center border-[1px] border-blue-500 text-blue-500 rounded-lg cursor-pointer transition duration-200 ease-in-out transform hover:bg-blue-500 hover:text-white hover:shadow-lg active:bg-blue-600 md:py-1.5 sm:mx-auto lg:w-full'>Follow</p>
                    }
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
            <div className={`${posts.length > 0 ? 'grid grid-cols-3 ' : 'flex '} h-auto mb-20 font-semibold text-xl gap-1 px-2 py-1 lg:gap-2`}>
                {
                    posts.length > 0
                        ? posts.map((post, index) => (
                            <NavLink to={`/single-post/` + post._id} key={index} className='w-28 aspect-square flex justify-center items-center md:w-36 lg:w-40 xl:w-44 2xl:w-48 cursor-pointer border-[1px] border-black'><img src={post.image} alt="post" className='w-full h-full object-contain' /></NavLink>
                        ))
                        : <span className='w-full h-40 flex justify-center items-center'>No Posts</span>
                }
            </div>
        </div>
    )
}

export default SearchUserDetails