import React, { useState } from "react";
import ChatbotImage from "../assets/chatbot.svg";
import Navbar from "../components/Navbar";

const RegisterPage = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement login logic here
    console.log("Email:", email);
    console.log("Password:", password);
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
                Join BrightBestie Today!
              </h2>
              <p className="font-medium text-center mb-6">
                Unlock your personalized consultations and study materials to
                uplift your journey
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
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-gray-700 font-semibold mb-2"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    className="w-3/12 text-white py-2 rounded-lg bg-[#0b7b71] hover:bg-[#055851] transition duration-300 text-center"
                  >
                    Register
                  </button>
                </div>
              </form>
              <p className="font-medium text-center mt-6">
                If you already have account, please login{" "}
                <a
                  className="text-[#0b7b71] hover:text-[#055851] font-semibold"
                  href="/login"
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

export default RegisterPage;
