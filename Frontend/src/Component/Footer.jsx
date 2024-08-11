import React from 'react'
import { BsChatFill } from "react-icons/bs";
import { IoCamera } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";


function Footer() {
    return (
        <div className='w-full mx-auto flex h-auto gap-2 border-2 border-black justify-evenly py-2 sm:w-[60%] lg:w-[50%] xl:w-[45%] 2xl:w-[40%]'>
            <CgProfile size={45} className='' />
            <IoCamera size={45} className='' />
            <IoSearch size={45} className='' />
            <BsChatFill size={45} className='' />
        </div>
    )
}

export default Footer