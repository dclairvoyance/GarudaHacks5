import React from "react";
import PeaopleImage from "../assets/People.svg";
import { useNavigate } from "react-router-dom";
import BusinessStats from "../components/BussinessStats";
import { useSpring, animated } from "react-spring";
import Navbar from "../components/Navbar";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const navigateConsultation = () => {
    navigate("/consultation");
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full bg-white">
        {/* landing page */}
        <div
          className="relative flex flex-col md:flex-row items-center justify-between h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('./BG.svg')" }}
        >
          <div className="flex-3 p-16 md:p-16 md:ml-8 my-auto">
            <h1 className="text-7xl mb-3">Uplift your journey with</h1>
            <h1 className="text-7xl font-bold mb-6">BrightBestie</h1>
            <p className="text-2xl mb-4">Tagline Tagline Tagline</p>
            <button
              onClick={() => navigateConsultation()}
              className="bg-white text-black font-medium text-2xl px-8 py-4 rounded-2xl mt-4 shadow-xl hover:bg-black hover:border-white hover:text-white"
            >
              ChatBot
            </button>
          </div>

          <div className="flex-2 hidden md:flex justify-center items-center">
            <img
              src={PeaopleImage}
              alt="Homepage visual"
              className="absolute bottom-0 right-8  h-[75%]"
            />
          </div>
        </div>

        <BusinessStats />

        {/* service */}
        <div className="flex flex-col items-center justify-center h-full bg-white py-12">
          <h1 className="text-5xl font-bold mb-8">Our Services</h1>
          <div className="flex flex-col md:flex-row items-center justify-between w-full px-8">
            <div className="flex-1 p-8 flex flex-col items-center">
              <img
                src="path/to/image1.jpg"
                alt="Service 1"
                className="w-32 h-32 mb-4 rounded-full object-cover"
              />
              <h2 className="text-3xl font-bold mb-4">Service 1</h2>
              <p className="text-md text-center">
                Description Description Description Description Description
              </p>
            </div>
            <div className="flex-1 p-8 flex flex-col items-center">
              <img
                src="path/to/image2.jpg"
                alt="Service 2"
                className="w-32 h-32 mb-4 rounded-full object-cover"
              />
              <h2 className="text-3xl font-bold mb-4">Service 2</h2>
              <p className="text-md text-center">
                Description Description Description Description Description
              </p>
            </div>
            <div className="flex-1 p-8 flex flex-col items-center">
              <img
                src="path/to/image3.jpg"
                alt="Service 3"
                className="w-32 h-32 mb-4 rounded-full object-cover"
              />
              <h2 className="text-3xl font-bold mb-4">Service 3</h2>
              <p className="text-md text-center">
                Description Description Description Description Description
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
