import React, { useState } from 'react'
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { RiLockPasswordFill } from "react-icons/ri";
import { AiFillDelete } from "react-icons/ai";
import { MdOutlineReportProblem } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggle } from './store/toggleSlice';
import axios from 'axios';


function Settings() {
    const [deleteAccountPop, setDeleteAccountPop] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    async function deleteAccount() {
        try {
            const response = await axios.post('/api/v1/users/delete-account', {});
            localStorage.removeItem("userId")
            if (response.status === 200) {
                navigate('/login')
            }
        } catch (error) {
            console.log('Error while deleting Account',error);
        }
    }

    function handleBack() {
        navigate(-1)
    }

    return (
        <div className='w-full h-auto flex flex-col'>
            <div className='w-full h-auto p-3 flex gap-4 items-center border-x-[1px] border-b-[1px] border-black'>
                <BsArrowLeft onClick={handleBack} size={25} className='text-black cursor-pointer' />
                <span className='md:text-lg font-semibold'>Settings</span>
            </div>
            <div className='w-full h-auto flex flex-col px-3 py-2 gap-5'>
                <NavLink to='change-password' className='w-full h-auto py-3 flex gap-5 items-center cursor-pointer bg-gray-50 rounded-lg shadow-md px-2 md:text-lg font-semibold active:bg-indigo-500 md:hover:bg-indigo-500 active:text-white md:hover:text-white'>
                    <RiLockPasswordFill size={25} className='' />
                    Change Password
                </NavLink>
                <div onClick={() => {setDeleteAccountPop(!deleteAccountPop); dispatch(toggle(true)) }} className='w-full h-auto py-3 flex gap-5 items-center cursor-pointer bg-gray-50 rounded-lg shadow-md px-2 md:text-lg font-semibold active:bg-indigo-500 md:hover:bg-indigo-500 active:text-white md:hover:text-white'>
                    <AiFillDelete size={25} className='' />
                    Delete Account
                </div>
            </div>
            {deleteAccountPop && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                        <div className='w-full h-auto flex justify-center items-center mb-3'>
                            <span className='p-4 rounded-full bg-red-100'>
                                <MdOutlineReportProblem size={30} className='text-red-500' />
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold mb-1">Delete Account</h2>
                        <h2 className="text-base font-medium text-gray-500 mb-6">Are you sure you want to delete your Account?</h2>
                        <div onClick={deleteAccount} className='w-full h-auto bg-red-600 font-medium text-center text-white rounded-lg py-2 mb-4 cursor-pointer active:bg-red-700 hover:bg-red-700'>Yes</div>
                        <div onClick={() => { setDeleteAccountPop(!deleteAccountPop); dispatch(toggle(false)) }} className='w-full h-auto bg-gray-100 font-medium text-center text-black rounded-lg py-2 cursor-pointer active:bg-gray-200 hover:bg-gray-200'>No</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Settings