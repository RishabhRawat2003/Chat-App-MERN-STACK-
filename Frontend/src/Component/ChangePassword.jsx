import React, { useState } from 'react'
import { BsArrowLeft } from "react-icons/bs";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { MdOutlineDone } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'


function ChangePassword() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordChangedPopup, setPasswordChangedPopup] = useState(false)

    const navigate = useNavigate()

    function passwordShow(pass) {
        if (pass === 'newPassword') {
            setShowNewPassword(!showNewPassword)
            const password = document.getElementsByName('password2')
            if (password[0].type === 'password') {
                password[0].type = 'text'
            } else {
                password[0].type = 'password'
            }
        } else {
            setShowCurrentPassword(!showCurrentPassword)
            const password = document.getElementsByName('password')
            if (password[0].type === 'password') {
                password[0].type = 'text'
            } else {
                password[0].type = 'password'
            }
        }
    }

    async function changePassword() {
        try {
            const response = await axios.post('/api/v1/users/change-password', { oldPassword: currentPassword, newPassword });
            console.log(response.data.data)
            setPasswordChangedPopup(!passwordChangedPopup)
            setCurrentPassword('')
            setNewPassword('')
        } catch (error) {
            console.log('Error while changing Password', error);
        }
    }

    function handleOk() {
        setPasswordChangedPopup(!passwordChangedPopup)
    }

    function handleBack() {
        navigate(-1)
    }
    return (
        <div className='w-full h-auto flex flex-col'>
            <div className='w-full h-auto p-3 flex gap-4 items-center border-x-[1px] border-b-[1px] border-black'>
                <BsArrowLeft onClick={handleBack} size={25} className='text-black cursor-pointer' />
                <span className='md:text-lg font-semibold'>Change Password</span>
            </div>
            <div className='w-full h-auto flex flex-col p-3'>
                <h1 className='text-xl font-semibold'>Change password</h1>
                <p className='text-sm md:text-base text-gray-700 my-3'>Your password must be at least 6 characters and you can include a combination of numbers, letters and special characters.</p>
                <div className='w-full h-auto flex flex-col'>
                    <div className='h-10 rounded-md mb-3 w-[70%] relative flex items-center'><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current password" name='password' className='px-2 border-2 w-full h-full rounded-md relative z-10' required /><span className='absolute right-1 px-1 z-20 bg-white' onClick={() => passwordShow('currentPassword')}>{showCurrentPassword ? <IoEye size={25} /> : <IoEyeOff size={25} />}</span></div>
                    <div className='h-10 rounded-md mb-3 w-[70%] relative flex items-center'><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" name='password2' className='px-2 border-2 w-full h-full rounded-md relative z-10' required /><span className='absolute right-1 px-1 z-20 bg-white' onClick={() => passwordShow('newPassword')}>{showNewPassword ? <IoEye size={25} /> : <IoEyeOff size={25} />}</span></div>
                </div>
                <div className='w-full h-auto my-10'>
                    <div onClick={changePassword} className='w-60 h-auto flex justify-center items-center bg-blue-500 text-white font-semibold md:hover:bg-blue-600 active:bg-blue-800 select-none py-2 cursor-pointer rounded-lg shadow-md'>Change password</div>
                </div>
            </div>
            {passwordChangedPopup && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                        <div className='w-full h-auto flex justify-center items-center mb-3'>
                            <span className='p-4 rounded-full bg-green-100'>
                                <MdOutlineDone size={30} className='text-green-500' />
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold mb-1">Password Changes Successfully</h2>
                        <div onClick={handleOk} className='w-14 h-auto mx-auto mt-4 bg-green-600 font-medium text-center text-white rounded-lg py-2 mb-4 cursor-pointer active:bg-green-700 hover:bg-green-700'>OK</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChangePassword