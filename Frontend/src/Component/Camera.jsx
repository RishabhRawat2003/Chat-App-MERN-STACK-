import React, { useRef, useState, useEffect } from 'react';
import { MdOutlineCameraswitch } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { getPostDetails } from './store/postSlice.js';
import { useNavigate } from 'react-router-dom';
import { setImagePath } from './store/postSlice.js';
import { setRotate } from './store/postSlice.js';

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [image, setImage] = useState(null);
  const [frontCamera, setFrontCamera] = useState(true);
  const [rotateImage, setRotateImage] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: frontCamera ? 'user' : 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing the camera:', error);
      }
    };

    if (isCameraActive) {
      startCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isCameraActive, frontCamera]);

  const capturePhoto = (event) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    setRotateImage(true);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const photoDataURL = canvas.toDataURL('image/webp');

    const dataURLToBlob = (dataURL) => {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    };

    const blob = dataURLToBlob(photoDataURL);
    const file = new File([blob], "captured_photo.webp", {
      type: "image/webp",
      lastModified: new Date().getTime(),
    });

    // console.log(file);
    dispatch(getPostDetails(file))
    dispatch(setImagePath(photoDataURL))
    dispatch(setRotate(true))

    setImage(photoDataURL);
    setIsCameraActive(false);
  };


  function retake() {
    setIsCameraActive(true);
    setRotateImage(false);
    dispatch(setRotate(false))
  }

  const selectPhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
      // console.log(file);
      dispatch(setRotate(false))
      dispatch(getPostDetails(file))
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(setImagePath(reader.result))
        setImage(reader.result);
        setIsCameraActive(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const switchCamera = () => {
    setFrontCamera(prev => !prev);
  };

  const nextStep = () => {
    // console.log('Proceed to the next step with image:', image);
    navigate('/upload-post')
  };

  return (
    <div className="relative w-full h-[92vh] bg-gray-800 flex items-center justify-center z-10">
      {isCameraActive ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover transform scale-x-[-1]"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <button
            onClick={capturePhoto}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-10 bg-white rounded-full shadow-xl"
          >
          </button>

          <label htmlFor="file-input" className="absolute bottom-10 left-6 px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg cursor-pointer hover:bg-gray-600">
            Browse
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={selectPhoto}
            className="hidden"
          />

          <button
            onClick={switchCamera}
            className="absolute top-10 right-6 px-4 py-2 bg-green-500 rounded-full shadow-lg hover:bg-green-600"
          >
            <MdOutlineCameraswitch size={25} />
          </button>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center ">
          {image && (
            <>
              <img
                src={image}
                alt="Captured or Selected"
                className={`${rotateImage ? 'rotateY' : ''} rotate w-full h-auto max-w-screen-md object-contain `}

              />
              <button
                onClick={nextStep}
                className="mt-4 px-4 py-2 absolute bottom-10 right-10 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
              >
                Next
              </button>
              <button
                onClick={retake}
                className="mt-4 px-4 py-2 absolute bottom-10 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
              >
                Retake
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
