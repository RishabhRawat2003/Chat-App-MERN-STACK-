import React from 'react'
import { NavLink } from 'react-router-dom';

function Register() {
  return (
    <>
      <div className='w-[90%] h-auto mx-auto my-8 flex flex-col sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%]'>
        <h2 className='text-3xl mt-2 text-center text-blue-500 font-semibold lg:text-4xl'>Let's Start</h2>
        <h5 className='text-xs text-center lg:text-sm'>Create an Account</h5>
        <div className='flex flex-col h-auto mx-4 my-6 gap-2'>
          <p className='font-semibold'>Fullname</p>
          <input type="text" placeholder="Enter your Fullname" className='px-2 border-2 h-10 rounded-md mb-3' />
          <p className='font-semibold'>Username</p>
          <input type="text" placeholder="Create Username" className='px-2 border-2 h-10 rounded-md mb-3' />
          <p className='font-semibold'>Email</p>
          <input type="text" placeholder="E.g. alex@gmail.com" className='px-2 border-2 h-10 rounded-md mb-3' />
          <p className='font-semibold'>Password</p>
          <input type="password" placeholder="Create password" className='px-2 border-2 h-10 rounded-md mb-3' />
        </div>
        <button className='mx-4 h-12 bg-blue-500 text-white rounded-lg mb-6'>Sign Up</button>
        <p className='text-sm font-semibold text-gray-500 mb-3 flex justify-center'>Already registered? <NavLink to='/' className='text-blue-600 ml-1 active:underline active:underline-offset-4 md:cursor-pointer md:hover:underline md:hover:underline-offset-4 select-none'>Sign In</NavLink></p>
      </div>
    </>
  )
}

export default Register