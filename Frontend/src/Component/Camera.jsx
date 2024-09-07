import React, { useRef, useState, useEffect } from 'react';
import { MdOutlineCameraswitch } from "react-icons/md";

const CameraComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [image, setImage] = useState(null);
  const [frontCamera, setFrontCamera] = useState(true); // Default to front camera

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

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    // Set canvas dimensions to match the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    // Draw the video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get the photo as a data URL
    const photo = canvas.toDataURL('image/jpeg');
    setImage(photo);
    setIsCameraActive(false);
  };

  const selectPhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
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
    // Handle the next step (e.g., navigate to another component or screen)
    console.log('Proceed to the next step with image:', image);
  };

  return (
    <div className="relative w-full h-screen bg-gray-800 flex items-center justify-center z-10">
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
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 p-10 bg-white rounded-full shadow-xl"
          >
          </button>

          <label htmlFor="file-input" className="absolute bottom-20 left-32 px-4 py-2 bg-gray-700 text-white rounded-full shadow-lg cursor-pointer hover:bg-gray-600">
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
            className="absolute top-16 right-10 px-4 py-2 bg-green-500 rounded-full shadow-lg hover:bg-green-600"
          >
            <MdOutlineCameraswitch size={25} />
          </button>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          {image && (
            <img
              src={image}
              alt="Captured or Selected"
              className="w-full h-auto max-w-screen-md object-contain"
              style={{ transform: 'rotate(0deg)' }}
            />
          )}
          <button
            onClick={nextStep}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
          >
            Next
          </button>
          <button
            onClick={() => setIsCameraActive(true)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
          >
            Retake
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
