import React, { useEffect, useState } from 'react'
import { json, NavLink } from 'react-router-dom';
import { PiHandWavingFill } from "react-icons/pi";
import googleLogo from './Image/google.png'
import { MdArrowOutward } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from "react-icons/fi";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import Cookies from 'js-cookie'
import axios from 'axios';

function Login() {

    const [loading, setLoading] = useState(false)
    const [popUp, setPopUp] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
    })
    const navigate = useNavigate()

    function handleChange(event) {
        const { name, value } = event.target;
        setForm(prevForm => {
            if (name === "email") {
                return {
                    ...prevForm,
                    email: value,
                    username: value
                };
            } else {
                return {
                    ...prevForm,
                    [name]: value
                };
            }
        });
    }

    function closePopUp() {
        setPopUp(false)
        setErrorMessage(false)
    }

    function passwordShow() {
        setShowPassword(!showPassword)
        const password = document.getElementsByName('password')
        if (password[0].type === 'password') {
            password[0].type = 'text'
        } else {
            password[0].type = 'password'
        }
    }

    function loginUser() {
        if (form.username !== '' && form.email !== '' && form.password !== '') {
            setPopUp(true)
            setLoading(true)
            axios.post('/api/v1/users/login', form, {
                withCredentials: true
            })
                .then((response) => {
                    // console.log(response.data.data);
                    // const { accessToken, refreshToken } = response.data.data
                    // Cookies.set('accessToken', accessToken, { expires: 1, sameSite: 'None', secure: true });
                    // Cookies.set('refreshToken', refreshToken, { expires: 10, sameSite: 'None', secure: true });
                    setTimeout(() => {
                        setForm({
                            email: "",
                            username: "",
                            password: "",
                        })
                        setLoading(false)
                        setPopUp(false)
                        navigate('/')
                    }, 3000);
                }).catch((error) => {
                    setLoading(false)
                    setErrorMessage(true)
                })
        }
    }

    return (
        <>
            <div className='w-[90%] h-auto mx-auto my-8 flex flex-col sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%]'>
                <h2 className='mx-4 text-4xl my-2'>Login</h2>
                <p className='mx-4 mb-2 flex gap-2 items-center'>Hi, Welcome back <PiHandWavingFill size={20} className='rotate-[-10deg] text-yellow-500' /></p>
                <div className='mx-4 h-12 border-[1px] border-gray-400 my-3 flex items-center justify-center gap-3 rounded-md cursor-pointer'>
                    <img src={googleLogo} alt="googleLogo" className='w-6' />
                    <span className='font-semibold'>Login with Google</span>
                </div>
                <div className='h-auto my-3 mx-4 flex items-center gap-3 justify-center'>
                    <p className='w-full h-[1px] bg-gray-400'></p>
                    <span className='w-[127%] text-xs text-gray-400 font-semibold text-center'>or Login with Email</span>
                    <p className='w-full h-[1px] bg-gray-400'></p>
                </div>
                <div className='flex flex-col h-auto mx-4 gap-2 relative z-10'>
                    <p className='font-semibold'>Email or Username</p>
                    <input type="text" placeholder="E.g. alex@gmail.com" name='email' value={form.email} onChange={handleChange} className='px-2 border-2 h-10 rounded-md mb-3' required />
                    <div className={popUp ? 'absolute z-30 w-full items-center justify-center h-auto flex flex-col rounded-lg shadow-xl' : 'hidden'}>
                        {/* <div className={popUp ? 'absolute z-30 w-full items-center justify-center h-48 flex flex-col bg-blue-500 border-2 border-blue-500 rounded-lg shadow-xl' : 'hidden'}> */}
                        <div className={`${loading ? "rounded-lg w-full z-20 flex flex-col items-center justify-center bg-gray-100 p-6 border border-gray-300 shadow-lg" : "hidden"} transition-opacity duration-300 ease-in-out`}>
                            <div className="spinner border-t-4 mt-5 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
                            <p className='mt-7 mb-3 font-bold text-gray-700 text-lg'>Logging in, please wait...</p>
                        </div>
                        <div className={`${errorMessage ? 'flex flex-col w-full max-w-sm p-6 items-center bg-red-100 border border-red-300 shadow-md rounded-lg' : 'hidden'} transition-transform duration-300 ease-in-out`}>
                            <div className='text-center flex justify-center mt-2'>
                                <span className='p-3 border-[1px] border-red-300 rounded-full bg-red-50'>
                                    <FiAlertTriangle size={40} className='text-red-500' />
                                </span>
                            </div>
                            <p className='text-base font-bold mt-4 text-red-700'>Invalid Username or Password</p>
                            <button
                                onClick={closePopUp}
                                className='bg-red-500 text-white px-7 py-2 rounded-lg mt-6 font-semibold border-[1px] border-red-500 transition transform duration-200 ease-in-out hover:bg-red-600 hover:-translate-y-1 active:bg-red-700'
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                    <p className='font-semibold'>Password</p>
                    <div className='h-10 rounded-md mb-3 w-full relative flex items-center'><input type="password" placeholder="Enter your password" name='password' value={form.password} onChange={handleChange} className='px-2 border-2 w-full h-full rounded-md relative z-10' required /><span className='absolute right-1 px-1 z-20 bg-white' onClick={passwordShow}>{showPassword ? <IoEye size={25} /> : <IoEyeOff size={25} />}</span></div>
                </div>
                <div className='mx-4 flex justify-between mb-4'>
                    <div className='flex gap-2 items-center justify-center'>
                        <input type="checkbox" id='remember' />
                        <label htmlFor="remember">
                            <span className='text-sm font-semibold select-none'>Remember Me</span>
                        </label>
                    </div>
                    <div>
                        <span className='text-blue-500 text-sm font-semibold md:cursor-pointer md:hover:underline md:hover:underline-offset-4 active:underline active:underline-offset-4 select-none'>Forgot Password?</span>
                    </div>
                </div>
                <button onClick={loginUser} className='mx-4 h-12 bg-blue-500 text-white rounded-lg mb-6 active:bg-blue-600 md:hover:bg-blue-600'>Login</button>
                <p className='text-sm font-semibold text-gray-500 mb-3 flex justify-center'>Not registered yet? <NavLink to='register' className='text-blue-600 flex items-center ml-1 active:underline active:underline-offset-4 md:cursor-pointer md:hover:underline md:hover:underline-offset-4 select-none'>Create an account <MdArrowOutward size={15} /></NavLink></p>
            </div>
        </>
    )
}

export default Login