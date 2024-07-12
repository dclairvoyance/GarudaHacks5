import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatbotImage from "../assets/chatbot.svg";
import Navbar from "../components/Navbar";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem("isLogin", "true");
      navigate("/tracker");
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col w-full bg-white">
        <div
          className="relative flex flex-col md:flex-row items-center justify-center h-[calc(100vh-4rem)] bg-cover bg-center"
          style={{ backgroundImage: "url('./BG.svg')" }}
        >
          <div
            className="flex items-center justify-center flex-1 h-full"
            style={{ backgroundImage: "url('./BG-education.svg')" }}
          >
            <div className="p-8 rounded-lg w-full max-w-xl">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Welcome Back to BrightBestie!
              </h2>
              <p className="font-medium text-center mb-6">
                Explore the latest scholarship opportunities, personalized study
                materials, and track your progress with ease.
              </p>
              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    required
                  />
                </div>
                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    className={`w-3/12 text-white py-2 rounded-lg transition duration-300 text-center ${
                      loading
                        ? "bg-green-500"
                        : "bg-[#0b7b71] hover:bg-[#055851]"
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white mx-auto"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </form>
              <p className="font-medium text-center mt-6">
                If you don't have an account, please register{" "}
                <a
                  className="text-[#0b7b71] hover:text-[#055851] font-semibold"
                  href="/register"
                >
                  here
                </a>
              </p>
            </div>
          </div>

          <div className="flex-1 hidden md:flex justify-center items-center">
            <img
              src={ChatbotImage}
              alt="Homepage visual"
              className="w-8/12 h-auto"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
