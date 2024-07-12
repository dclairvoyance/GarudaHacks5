import React from "react";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import BusinessStats from "../components/BussinessStats";
import Navbar from "../components/Navbar";
import Services from "../components/Services.tsx";
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
          className="relative flex flex-col md:flex-row items-center justify-between h-[calc(100vh-4rem)] bg-cover bg-center"
          style={{ backgroundImage: "url('./BG.svg')" }}
        >
          <div className="flex-2 p-16 md:p-16 md:ml-8 my-auto">
            <h1 className="text-5xl mb-3">Uplift your journey with</h1>
            <h1 className="text-5xl font-bold mb-6">BrightBestie</h1>
            <p className="text-2xl mb-4">
              Take control of your education and career today!
            </p>
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

        <Services />
      </div>
    </>
  );
};

export default HomePage;
