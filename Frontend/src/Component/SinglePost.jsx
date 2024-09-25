import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { BsArrowLeft } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FaComment } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
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
    const [commentInput, setCommentInput] = useState('')
    const [postDeleteToggle, setPostDeleteToggle] = useState(false)
    const [postLikeRefresh, setPostLikeRefresh] = useState(false)
    const [commentsDiv, setCommentsDiv] = useState(false)
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

    async function deleteComment(commentId) {
        try {
            const response = await axios.post('/api/v1/comments/delete-comment', { postId: id, commentId });
            if (response.status === 200) setPostLikeRefresh(!postLikeRefresh)
        } catch (error) {
            console.log("Error while deleting Comment", error);
        }
    }

    async function submitComment() {
        try {
            const response = await axios.post('/api/v1/comments/send-comment', { postId: id, comment: commentInput });
            setCommentInput('')
            if (response.status === 200) setPostLikeRefresh(!postLikeRefresh)
        } catch (error) {
            console.error("Error while submitting comment", error)
        }
    }

    useEffect(() => {
        const fetechSinglePostDetails = async () => {
            try {
                const response = await axios.post('/api/v1/posts/single-post', { postId: id })
                const response2 = await axios.post('/api/v1/comments/all-comments', { postId: id })
                const commentsArr = response2.data.data
                // console.log(response.data.data);
                const { caption, createdAt, image, like, owner } = response.data.data
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
                    comments: commentsArr,
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
                postDetails.username
                    ? <div className='w-full h-auto flex flex-col overflow-hidden'>
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
                                <FaComment onClick={() => setCommentsDiv(true)} size={25} className='hover:fill-gray-500 cursor-pointer fill-gray-300' />
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
                        <div className={`${commentsDiv ? 'absolute bottom-14 w-full h-[80vh] bg-gray-50 flex flex-col border-x-[1px] border-gray-400 border-t-[1px] rounded-t-xl z-20' : 'hidden'} `}>
                            <div className='w-full h-auto flex justify-end items-center p-3'><IoCloseOutline size={30} className='cursor-pointer' onClick={() => setCommentsDiv(false)} /></div>
                            <div className='flex-1 w-full h-auto overflow-y-scroll flex flex-col py-2 px-3 gap-3'>
                                {
                                    commentsDiv ?
                                        postDetails.comments.map((comment, index) => (
                                            <div key={index} className='w-full flex border-[1px] border-gray-300 px-3 min-h-16 items-center rounded-md md:hover:bg-gray-100 cursor-pointer]'>
                                                <img src={comment.owner.profileImage} alt="owner Image" className='w-12 h-12 rounded-full border-[1px] border-gray-300' />
                                                <div className='flex-1 flex flex-col h-full px-4 justify-center'>
                                                    <span className='text-black font-semibold text-lg'>{comment.owner.username}</span>
                                                    <span className='text-gray-600 text-sm'>{comment.content}</span>
                                                </div>
                                                {
                                                    comment.owner._id === currentUserId || postDetails.ownerId === currentUserId
                                                        ? <div className='w-10 h-full flex justify-center items-center'>
                                                            <MdDeleteOutline onClick={() => deleteComment(comment._id)} size={25} className='md:hover:text-red-500 active:text-red-500 cursor-pointer' />
                                                        </div>
                                                        : null
                                                }
                                            </div>
                                        )) : null
                                }
                            </div>
                            <div className='w-full h-14 rounded-xl flex justify-center'>
                                <div className='w-[80%] flex h-10 border-[1px] border-gray-500 bg-gray-100 rounded-xl'>
                                    <input type="text" value={commentInput} onChange={(e) => setCommentInput(e.target.value)} placeholder='Write your comment here..' className='outline-none px-3 bg-gray-100 flex-1 rounded-xl' />
                                    <div className='p-1.5 px-2 rounded-full flex items-center cursor-pointer'>
                                        <span onClick={submitComment}>
                                            <IoMdSend size={20} />
                                        </span>
                                    </div>
                                </div>
                            </div>
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