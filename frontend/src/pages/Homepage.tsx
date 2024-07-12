import React from "react";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import BusinessStats from "../components/BussinessStats";
import Navbar from "../components/Navbar";
import peopleHp from "../assets/lottie/people-hp.json";
import rightArrow from "../assets/lottie/rightArrow.json";

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
          <div className="flex-2 p-16 md:p-16 md:ml-8 my-auto">
            <h1 className="text-5xl mb-3">Uplift your journey with</h1>
            <h1 className="text-5xl font-bold mb-6">BrightBestie</h1>
            <p className="text-2xl mb-4">Tagline Tagline Tagline</p>
            <button
              onClick={() => navigateConsultation()}
              className="bg-white text-black font-medium text-2xl pl-4 py-0 rounded-2xl mt-4 shadow-xl hover:bg-black hover:border-white hover:text-white"
              style={{ display: "flex", alignItems: "center" }}
            >
              <p className="text-xl text-[#0b7b71]">Consultation</p>
              <Lottie
                animationData={rightArrow}
                loop={true}
                style={{ width: "64px", height: "64px" }}
              />
            </button>
          </div>

          <div className="flex-1 hidden md:flex justify-center items-center">
            <Lottie
              animationData={peopleHp}
              style={{ width: "100%", height: "100%" }}
              loop={true}
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
