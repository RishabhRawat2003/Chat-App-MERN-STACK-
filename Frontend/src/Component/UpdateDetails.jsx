import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const server = import.meta.env.VITE_SERVER;

function UpdateDetails() {
    const [popUp, setPopUp] = useState(false);
    const [defaultProfile, setDefaultProfile] = useState(true);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({
        fullName: '',
        email: '',
        bio: '',
        profileImage: '',
        createdAt: '',
        username: ''
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            setSelectedImage(file);
            setDefaultProfile(false);
        }
    };

    const handleChanges = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    };

    const closePopup = () => {
        setPopUp(false);
    };

    const handleCancel = () => {
        navigate('/');
    };

    const uploadImage = async () => {
        if (selectedImage) {
            setLoading(true)
            const formData = new FormData();
            formData.append('profileImage', selectedImage);
            try {
                await axios.post('/api/v1/users/update-profile-image', formData);
            } catch (error) {
                console.error('Error uploading image:', error);
                setLoading(false)
            }
        }
    };

    const updateChanges = async () => {
        try {
            setLoading(true)
            const details = {
                fullName: data.fullName,
                email: data.email,
                bio: data.bio,
            };
            await axios.post('/api/v1/users/update-account-details', details);
            await uploadImage()
            setTimeout(() => {
                setLoading(false)
                setPopUp(true)
            }, 2000);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.post('/api/v1/users/user-details');

                const { email, fullName, bio, profileImage, createdAt, username } = response.data.data;
                const dateObj = new Date(createdAt);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();
                const formattedDate = `${day}-${month}-${year}`;

                if (profileImage !== '/temp/default.jpg') {
                    setDefaultProfile(false);
                    setPreviewImage(profileImage);
                }

                setData({
                    email,
                    fullName,
                    bio,
                    profileImage,
                    createdAt: formattedDate,
                    username
                });

            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };
        fetchUserDetails();
    }, []);

    return (
        <div className='flex flex-col'>
            <div className='w-full h-auto flex flex-col justify-center items-center space-y-4'>
                <div className='w-32 h-32'>
                    <img src={defaultProfile ? server + data.profileImage : previewImage} alt="Profile Image" className='w-full h-full object-cover rounded-full border border-gray-300 shadow-sm' />
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className='hidden' id="upload-button" />
                <label htmlFor="upload-button" className='bg-blue-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-blue-600 active:bg-blue-700 transition-colors'>
                    Choose Image
                </label>
            </div>
            <p className='w-full h-auto my-3 text-center'>Account created at : {data.createdAt}</p>
            <div className='w-full h-auto my-5 px-4 flex flex-col relative z-0'>
                <span className='sm:text-lg font-semibold'>Username</span>
                <input type="text" value={data.username} placeholder='Username' className='border-[1px] border-gray-500 mt-3 mb-1 h-10 px-3 bg-gray-100 rounded-md select-none outline-none' readOnly />
                <span className='text-sm font-semibold mb-2'>Note: <span className='font-normal'>You can change it after every 6 months</span></span>
                <span className='sm:text-lg font-semibold'>FullName</span>
                <div className={`${loading ? 'flex' : 'hidden'} fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 `} >
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center flex items-center justify-center flex-col w-60 h-40">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                        <p className="my-4 font-semibold">Updating details...</p>
                    </div>
                </div>
                {popUp && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Details updated successfully</h2>
                            <button
                                onClick={closePopup}
                                className="bg-green-500 text-white px-6 py-2 rounded-lg mt-2 hover:bg-green-600 active:bg-green-700 transition-colors"
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                )}
                <input type="text" value={data.fullName} placeholder='Fullname' name='fullName' onChange={handleChanges} className='border-[1px] border-gray-500 my-3 h-10 px-3 bg-gray-100 rounded-md' required />
                <span className='sm:text-lg font-semibold'>Email</span>
                <input type="email" value={data.email} placeholder='Email' name='email' onChange={handleChanges} className='border-[1px] border-gray-500 my-3 h-10 px-3 bg-gray-100 rounded-md' required />
                <span className='sm:text-lg font-semibold'>Bio</span>
                <textarea name="bio" value={data.bio} onChange={handleChanges} className='border-[1px] border-gray-500 my-3 px-3 py-1 bg-gray-100 rounded-md h-40 resize-none' required></textarea>
            </div>
            <div className='mt-2 w-full h-auto flex justify-end mb-4'>
                <div className='mr-5 w-56 flex justify-between items-center lg:w-64'>
                    <button onClick={handleCancel} className='bg-gray-200 border-2 border-gray-300 rounded-lg px-6 py-1 font-semibold active:bg-gray-300 md:hover:bg-gray-300 lg:px-7 lg:py-1.5 lg:text-lg'>Cancel</button>
                    <button onClick={updateChanges} className='bg-blue-500 border-2 border-blue-600 rounded-lg px-6 py-1 font-semibold text-white active:bg-blue-600 md:hover:bg-blue-600 lg:px-7 lg:py-1.5 lg:text-lg'>Update</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateDetails;
