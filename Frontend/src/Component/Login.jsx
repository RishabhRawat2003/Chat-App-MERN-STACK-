import React from 'react'
import { NavLink } from 'react-router-dom';
import { PiHandWavingFill } from "react-icons/pi";
import googleLogo from './Image/google.png'
import { MdArrowOutward } from "react-icons/md";

function Login() {
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
                <div className='flex flex-col h-auto mx-4 gap-2'>
                    <p className='font-semibold'>Email</p>
                    <input type="text" placeholder="E.g. alex@gmail.com" className='px-2 border-2 h-10 rounded-md mb-3' />
                    <p className='font-semibold'>Password</p>
                    <input type="password" placeholder="Enter your password" className='px-2 border-2 h-10 rounded-md mb-3' />
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
                <button className='mx-4 h-12 bg-blue-500 text-white rounded-lg mb-6'>Login</button>
                <p className='text-sm font-semibold text-gray-500 mb-3 flex justify-center'>Not registered yet? <NavLink to='/register' className='text-blue-600 flex items-center ml-1 active:underline active:underline-offset-4 md:cursor-pointer md:hover:underline md:hover:underline-offset-4 select-none'>Create an account <MdArrowOutward size={15} /></NavLink></p>
            </div>
        </>
    )
}

export default Login