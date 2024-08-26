import React, { useState, useEffect } from 'react'
import { BsChatFill } from "react-icons/bs";
import { IoCamera } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";


function Footer() {
    return (
        <div className='w-full mx-auto flex h-auto gap-2 border-2 border-black justify-evenly py-2'>
            <CgProfile size={45} className='cursor-pointer' />
            <IoCamera size={45} className='cursor-pointer' />
            <IoSearch size={45} className='cursor-pointer' />
            <BsChatFill size={45} className='cursor-pointer' />
        </div>
    )

}

export default Footer