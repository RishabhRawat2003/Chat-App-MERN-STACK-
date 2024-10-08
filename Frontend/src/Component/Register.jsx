import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import axios from 'axios'
import { TiTick } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle } from "react-icons/fi";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";

function Register() {
  const [form, setForm] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [popUp, setPopUp] = useState(false)
  const [message, setMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  function backToLogIn() {
    navigate('/')
    setPopUp(false)
    setMessage(false)
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

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function submitForm() {
    if (form.username !== '' && form.fullName !== '' && form.email !== '' && form.password !== '') {
      setPopUp(true)
      setLoading(true)
      axios.post('http://localhost:8000/api/v1/users/register', form)
        .then((response) => {
          setTimeout(() => {
            setForm({ username: '', fullName: '', email: '', password: '', })
            setLoading(false)
            setMessage(true)
          }, 2000);
        }).catch((error) => {
          setLoading(false)
          setErrorMessage(true)
        })
    }
  }

  return (
    <>
      <div className='w-[90%] h-auto mx-auto my-8 flex flex-col sm:w-[60%] md:w-[50%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%]'>
        <h2 className='text-3xl mt-2 text-center text-blue-500 font-semibold lg:text-4xl'>Let's Start</h2>
        <h5 className='text-xs text-center lg:text-sm'>Create an Account</h5>
        <div className='flex flex-col h-auto mx-4 my-6 gap-2 relative z-10'>
          <p className='font-semibold'>Fullname</p>
          <input type="text" placeholder="Enter your Fullname" name='fullName' value={form.fullName} onChange={handleChange} className='px-2 border-2 h-10 rounded-md mb-3' required />

          <p className='font-semibold'>Username</p>
          <input type="text" placeholder="Create Username" name='username' value={form.username} onChange={handleChange} className='px-2 border-2 h-10 rounded-md mb-3' required />
          <div className={`${popUp ? "flex flex-col" : "flex flex-col"} absolute z-30 w-full items-center justify-center translate-y-[40%] h-auto rounded-lg shadow-xl`} >
            <div className={`${loading ? "flex" : "hidden"} rounded-lg w-full z-20 bg-gray-100 border border-gray-300 flex-col items-center p-8`}>
              <div className="spinner border-t-4 mt-4 border-white rounded-full w-16 h-16 animate-spin"></div>
              <p className='mt-6 font-semibold text-gray-900 text-lg mb-3'>Registering ...</p>
            </div>
            <div className={`${message ? 'flex' : 'hidden'} flex-col w-full items-center bg-gray-100 border border-gray-300 rounded-lg p-6 shadow-lg`} >
              <div className='text-center flex mt-1'>
                <span className='p-4 border-2 border-green-500 rounded-full bg-green-100'>
                  <TiTick size={40} className='text-green-500' />
                </span>
              </div>
              <p className='text-lg font-bold mt-1 text-gray-800'>Account Created</p>
              <button
                onClick={backToLogIn}
                className='bg-green-500 text-white px-8 py-3 rounded-lg mt-6 font-semibold border-2 border-green-500 active:bg-green-600 md:hover:bg-green-600 transition-colors duration-200'
              >
                Log In
              </button>
            </div>
            <div className={`${errorMessage ? 'flex flex-col w-full items-center p-6 bg-red-100 border border-red-300 shadow-lg rounded-lg' : 'hidden'} transition duration-300 ease-in-out`}>
              <div className='text-center flex justify-center mt-4'>
                <span className='p-3 border-[1px] border-red-300 rounded-full bg-red-50'>
                  <FiAlertTriangle size={40} className='text-red-500' />
                </span>
              </div>
              <p className='text-base font-bold mt-4 text-red-700'>Username or Email Already Exists</p>
              <button
                onClick={closePopUp}
                className='bg-red-500 text-white px-7 py-2 rounded-lg mt-6 font-semibold border-[1px] border-red-500 transition transform duration-200 ease-in-out hover:bg-red-600 hover:-translate-y-1 active:bg-red-700'
              >
                Ok
              </button>
            </div>
          </div>
          <p className='font-semibold'>Email</p>
          <input type="text" placeholder="E.g. alex@gmail.com" name='email' value={form.email} onChange={handleChange} className='px-2 border-2 h-10 rounded-md mb-3' required />

          <p className='font-semibold'>Password</p>
          <div className='h-10 rounded-md mb-3 w-full relative flex items-center'><input type="password" placeholder="Create password" name='password' value={form.password} onChange={handleChange} className='px-2 border-2 w-full h-full rounded-md relative z-10' required /><span className='absolute right-1 px-1 z-20 bg-white' onClick={passwordShow}>{showPassword ? <IoEye size={25} /> : <IoEyeOff size={25} />}</span></div>

        </div>
        <button onClick={submitForm} className='mx-4 h-12 bg-blue-500 text-white rounded-lg mb-6 active:bg-blue-600 md:hover:bg-blue-600'>Sign Up</button>
        <p className='text-sm font-semibold text-gray-500 mb-3 flex justify-center'>Already registered? <NavLink to='/' className='text-blue-600 ml-1 active:underline active:underline-offset-4 md:cursor-pointer md:hover:underline md:hover:underline-offset-4 select-none'>Sign In</NavLink></p>
      </div>
    </>
  )
}

export default Register