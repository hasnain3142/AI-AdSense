import React from 'react';
import { useEffect } from 'react';
import ReactPlayer from 'react-player'

const HomeScreen = () => {
  useEffect(() => {
    var video = document.getElementById("video")
  });

  
  return (
    <div className="h-screen flex justify-center items-center bg-black">   
      <video id="video"  className="w-full h-full object-cover" autoPlay loop>
        <source src="Acno Fight DVC.mp4" type="video/mp4"/>
        Your browser does not support the video tag.
      </video>
    </div>
    
  );
};

export default HomeScreen;