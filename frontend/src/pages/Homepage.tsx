

import React from 'react';
import BGImage from '../assets/BG.svg'
import PeaopleImage from '../assets/People.svg'
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const navigate = useNavigate()

    const navigateConsultation=()=>{
        navigate("/consultation");
    }

    return (
      <div
        className="relative flex flex-col md:flex-row items-center justify-between h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('./BG.svg')" }} // Use local image from public folder
      >
        {/* Text Section */}
        <div className="flex-3 p-16 md:p-16 ml-8">
          <h1 className="text-7xl mb-4">Uplift your XXX with</h1>
          <h1 className="text-7xl font-bold mb-4">BrightBestie</h1>
          <p className='text-3xl mb-4'>Tagline Tagline Tagline</p>
          <button onClick={() => navigateConsultation()} className="bg-white text-black text-2xl px-12 py-4 rounded-full mt-4 shadow-xl hover:bg-black hover:border-white hover:text-white">
            ChatBot
        </button>
        </div>
  
        {/* Image Section */}
        <div className="flex-2 hidden md:flex justify-center items-center">
          <img
            src={PeaopleImage}
            alt="Homepage visual"
            className="absolute bottom-0 right-8 w-[32%] h-auto rounded-lg"
          />
        </div>
      </div>
    );
  };
  
  export default HomePage;