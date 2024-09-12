import React, { useState, useEffect } from 'react'
import { BsChatFill } from "react-icons/bs";
import { IoCamera } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { NavLink } from 'react-router-dom';


function Footer() {
    return (
        <div className='w-full mx-auto flex h-auto gap-2 border-2 border-black justify-evenly py-2'>
            <NavLink to='/'><CgProfile size={40} className='cursor-pointer sm:size-10' /></NavLink>
            <NavLink to='camera'><IoCamera size={40} className='cursor-pointer sm:size-10' /></NavLink>
            <NavLink to='search'><IoSearch size={40} className='cursor-pointer sm:size-10' /></NavLink>
            <NavLink to='conversations'><BsChatFill size={40} className='cursor-pointer sm:size-10' /></NavLink>
        </div>
    )

}

export default Footer