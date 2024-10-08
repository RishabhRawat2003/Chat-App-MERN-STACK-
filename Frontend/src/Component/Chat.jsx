import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { FcGallery } from "react-icons/fc";
import { IoMdSend } from "react-icons/io";
import { NavLink } from 'react-router-dom';
import { MdOutlineChevronRight } from "react-icons/md";
import io from "socket.io-client";

const server = import.meta.env.VITE_SERVER


function Chat() {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const messageDivRef = useRef(null);
    const [userData, setUserData] = useState({
        username: '',
        profileImage: ''
    });
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [toggle, setToggle] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("userId"));

    function handleBack() {
        navigate(-1);
    }

    async function handleSubmitMessage() {
        try {
            const messageData = {
                message
            };
            const response = await axios.post(`/api/v1/message/send/${id}`, messageData);
            setMessage('');
            setMessages((prevMessages) => [...prevMessages, response.data.data]);
            setTimeout(() => {
                messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
            }, 200);
        } catch (error) {
            console.error('Error while sending message', error);
        }
    }

    useEffect(() => {
        async function fetchUserDetails() {
            try {
                const details = { searchedUserId: id };
                const response = await axios.post('/api/v1/search/searched-user-details', details);
                const { username, profileImage } = response.data.data;
                setUserData({ username, profileImage });
            } catch (error) {
                console.log("Error while fetching user details", error);
            }
        }

        async function fetchPreviousMessages() {
            try {
                const response = await axios.get(`/api/v1/message/${id}`);
                setMessages(response.data.data);
            } catch (error) {
                console.log("Error while fetching previous messages", error);
            }
        }

        async function messageRead() {
            try {
                const response = await axios.post(`/api/v1/message/read-message/${id}`)
            } catch (error) {
                console.log("Error while reading message", error);
            }
        }
        
        fetchUserDetails();
        fetchPreviousMessages();
        messageRead()

        setTimeout(() => {
            messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
        }, 200);
    }, [id]);

    useEffect(() => {
        if (currentUser) {
            const socketInstance = io(server, {
                query: {
                    userId: currentUser,
                },
            });

            setSocket(socketInstance);

            socketInstance.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });

            return () => socketInstance.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [currentUser, server]);

    useEffect(() => {
        if (!socket) return;
        socket.on("newMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setTimeout(() => {
                messageDivRef.current.scrollTop = messageDivRef.current.scrollHeight;
            }, 200);
        });

        return () => socket.off("newMessage");
    }, [socket]);

    return (
        <div className='w-full h-screen flex flex-col sm:w-[60%] lg:w-[50%] xl:w-[45%] 2xl:w-[40%] mx-auto relative'>
            <div className='w-full flex justify-between items-center border-b-2 border-black py-3'>
                <div className='flex gap-4 px-2 items-center'>
                    <BsArrowLeft size={25} className='ml-3 cursor-pointer' onClick={handleBack} />
                    <NavLink to={'/user-profile/' + id} className='flex gap-4 items-center cursor-pointer'>
                        <img
                            src={userData.profileImage === '/temp/default.jpg' ? server + userData.profileImage : userData.profileImage}
                            alt="profile Image"
                            className='w-12 rounded-full'
                        />
                        <div className='flex flex-col justify-center gap-1'>
                            <span className='font-semibold text-lg lg:text-xl'>{userData.username}</span>
                            <span className='text-gray-500 text-xs flex items-center lg:text-sm'>View Profile <MdOutlineChevronRight size={20} className='text-gray-500' /></span>
                        </div>
                    </NavLink>
                </div>
            </div>

            <div ref={messageDivRef} className='w-full flex-grow overflow-y-auto p-3 scrollbar-none'>
                {
                    messages.map((user, index) => (
                        user.senderId !== id
                            ? <div key={index} className='w-full flex justify-end mt-3'>
                                <div className='w-auto rounded-full bg-blue-500 text-white flex items-center px-4 py-2 mr-2'>
                                    {user.message}
                                </div>
                            </div>
                            : <div key={index} className='w-full flex mt-3'>
                                <div className='w-auto rounded-full bg-gray-200 flex items-center px-4 py-2 ml-2'>
                                    {user.message}
                                </div>
                            </div>
                    ))
                }
            </div>

            <div className='w-full bg-white p-4'>
                <div className='w-[90%] h-12 border-[1px] border-black rounded-3xl mx-auto flex p-2'>
                    <div className='p-1.5 rounded-full bg-gray-200 flex items-center cursor-pointer'>
                        <FcGallery size={20} />
                    </div>
                    <div className='flex-1 px-3'>
                        <input
                            type="text"
                            placeholder='Message...'
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' ? handleSubmitMessage() : null}
                            className='w-full h-full px-1 outline-none'
                        />
                    </div>
                    <div className='p-1.5 rounded-full bg-gray-200 flex items-center cursor-pointer'>
                        <span onClick={handleSubmitMessage}>
                            <IoMdSend size={20} />
                        </span>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Chat