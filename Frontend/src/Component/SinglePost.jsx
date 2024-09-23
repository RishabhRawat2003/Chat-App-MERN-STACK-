import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { BsArrowLeft } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

function SinglePost() {
    const [postDetails, setPostDetails] = useState({
        username: '',
        profileImage: '',
        postImage: '',
        postText: '',
        likes: [],
        comments: [],
        createdAt: '',
        ownerId: ''
    })
    const [postDeleteToggle, setPostDeleteToggle] = useState(false)
    const [postLikeRefresh, setPostLikeRefresh] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()
    const currentUserId = JSON.parse(localStorage.getItem("userId"))

    async function handleDelete() {
        try {
            const response = await axios.post('/api/v1/posts/delete-post', { postId: id });
            if (response.status === 200) navigate(-1)
        } catch (error) {
            console.error(error)
        }
    }

    async function likeUnlike() {
        try {
            const response = await axios.post('/api/v1/posts/like-post', { postId: id });
            if (response.status === 200) setPostLikeRefresh(!postLikeRefresh)
        } catch (error) {
            console.error("Error While Liking Post", error)
        }
    }

    function handleBack() {
        navigate(-1)
    }

    useEffect(() => {
        const fetechSinglePostDetails = async () => {
            try {
                const response = await axios.post('/api/v1/posts/single-post', { postId: id });
                const { caption, comments, createdAt, image, like, owner } = response.data.data
                const dateObj = new Date(createdAt);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;
                setPostDetails({
                    username: owner.username,
                    profileImage: owner.profileImage,
                    postImage: image,
                    postText: caption,
                    likes: like,
                    comments: comments,
                    createdAt: formattedDate,
                    ownerId: owner._id
                })
            } catch (error) {
                console.log('Error while fetching single post details', error)
            }
        }
        fetechSinglePostDetails()
    }, [postLikeRefresh])

    return (
        <>
            {
                postDetails
                    ? <div className='w-full h-auto flex flex-col relative'>
                        <div className='w-full h-auto flex py-2 justify-between items-center'>
                            <div className='w-auto h-auto flex items-center'>
                                <BsArrowLeft size={25} className='ml-3 sm:size-8 cursor-pointer' onClick={handleBack} />
                                <img src={postDetails.profileImage} alt="image" className='w-10 rounded-full border-[1px] border-black ml-3' />
                                <span className='text-black font-semibold ml-3 text-lg md:text-xl'>{postDetails.username}</span>
                            </div>
                            <div className={`${currentUserId === postDetails.ownerId ? 'w-auto h-auto flex items-center' : 'hidden'} `}>
                                <BsThreeDotsVertical size={25} className='cursor-pointer' onClick={() => setPostDeleteToggle(!postDeleteToggle)} />
                                {
                                    postDeleteToggle
                                        ? <div className='absolute top-12 right-0 w-40 h-14 bg-gray-200 flex flex-col p-2 rounded-md'>
                                            <div onClick={handleDelete} className='w-full h-9 active:bg-blue-500 active:text-white md:hover:bg-blue-500 md:hover:text-white cursor-pointer flex items-center gap-2 font-semibold rounded-md'><MdDelete size={25} /> Delete</div>
                                        </div>
                                        : null
                                }
                            </div>
                        </div>
                        <div className='w-full h-[60vh] border-[1px] border-black'>
                            <img src={postDetails.postImage} alt="post" className='w-full h-full object-contain' />
                        </div>
                        <div className='w-full h-auto flex gap-6 px-3 items-center my-2 text-lg font-semibold'>
                            <div className='flex gap-2 items-center'>
                                <FaHeart onClick={likeUnlike} size={25} className={`${postDetails.likes.indexOf(currentUserId) !== -1 ? 'fill-red-500' : 'fill-gray-300'} hover:fill-red-500 cursor-pointer`} />
                                {postDetails.likes.length} Likes
                            </div>
                            <div className='flex gap-2 items-center'>
                                <FaComment size={25} className='hover:fill-red-500 cursor-pointer fill-gray-300' />
                                {postDetails.comments.length} Comments
                            </div>

                        </div>
                        <div className='w-full h-auto flex gap-2 items-center'>
                            <span className='font-semibold text-lg'>{postDetails.username}</span>
                            {postDetails.postText}
                        </div>
                        <div className='w-full h-auto flex gap-2 items-center text-xs text-gray-600 font-semibold mt-5 md:text-sm'>
                            {postDetails.createdAt}
                        </div>
                    </div>
                    : <div className="flex justify-center items-center min-h-screen bg-white relative z-50">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
                    </div>
            }
        </>
    )

}

export default SinglePost