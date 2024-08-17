import React, { useState, useEffect } from 'react'
import { BsChatFill } from "react-icons/bs";
import { IoCamera } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";


function Footer() {
    const user = JSON.parse(localStorage.getItem('user'))

    if (!user) null
    else {
        return (
            <div className='w-full mx-auto flex h-auto gap-2 border-2 border-black justify-evenly py-2 absolute bottom-0'>
                <CgProfile size={45} className='' />
                <IoCamera size={45} className='' />
                <IoSearch size={45} className='' />
                <BsChatFill size={45} className='' />
            </div>
        )
    }
}

export default Footer