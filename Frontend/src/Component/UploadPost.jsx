import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import axios from 'axios';

function UploadPost() {
    const [image, setImage] = useState(null);
    const [rotateImage, setRotateImage] = useState(false);
    const [caption, setCaption] = useState('');

    const postInfo = useSelector((state) => state.post.postDetails);
    const imagePath = useSelector((state) => state.post.imagePath);
    const rotateIndicator = useSelector((state) => state.post.rotateIndicator);

    const navigate = useNavigate();

    const fetchImageAsFile = async (url) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const file = new File([blob], postInfo?.name || 'uploaded_image', { type: postInfo?.type || blob.type });
            return file;
        } catch (error) {
            console.error('Error while converting image URL to File:', error);
            return null;
        }
    };

    async function upload() {
        try {
            const formData = new FormData();
            formData.append('caption', caption);
            let fileToUpload = postInfo instanceof File ? postInfo : await fetchImageAsFile(imagePath);

            if (fileToUpload) {
                formData.append('image', fileToUpload);
            } else {
                console.error('Failed to retrieve a valid File object.');
                return;
            }

            const response = await axios.post('/api/v1/posts/create-post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/');
        } catch (error) {
            console.log('Error While posting image', error);
        }
    }

    useEffect(() => {
        if (imagePath && postInfo && rotateIndicator) {
            setImage(imagePath);
            setRotateImage(rotateIndicator);
        } else {
            setImage(imagePath);
            setRotateImage(false);
        }
    }, [imagePath, postInfo, rotateIndicator]);

    function handleBack() {
        navigate(-1);
    }

    return (
        <div className="relative w-full flex flex-col mx-auto h-[100vh] sm:w-[60%] lg:w-[50%] xl:w-[45%] 2xl:w-[40%]">
            <div className="w-full h-auto flex sm:border-x-[1px] border-b-[1px] border-black py-2 items-center">
                <BsArrowLeft size={25} className="ml-3 sm:size-8 cursor-pointer" onClick={handleBack} />
                <span className="text-black font-semibold ml-6 text-lg md:text-xl">New Post</span>
            </div>
            <div className="">
                {image && (
                    <img
                        src={image}
                        alt="Captured or Selected"
                        className={`${rotateImage ? 'rotateY' : ''} rotate w-full h-[65vh] max-w-screen-md object-contain `}
                    />
                )}
            </div>
            <div className="my-3 w-full h-auto">
                <textarea
                    placeholder="Write Caption here ..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="bg-gray-100 rounded-md  w-full min-h-28 outline-none p-2 resize-none"
                />
            </div>
            <div className="w-full h-[1px] bg-black"></div>
            <div
                onClick={upload}
                className="bg-blue-500 w-[95%] h-12 mx-auto my-auto font-semibold flex justify-center items-center text-white rounded-lg shadow-lg hover:bg-blue-600 active:bg-blue-800 select-none cursor-pointer"
            >
                Share
            </div>
        </div>
    );
}

export default UploadPost;
