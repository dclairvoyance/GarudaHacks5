import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login";
import Articles from "./pages/Articles";
import ChatBot from "./pages/Chatbot";
import HomePage from "./pages/Homepage";
import TrackerComponent from "./pages/Tracker";
import RegisterPage from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/consultation" element={<ChatBot />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/tracker" element={<TrackerComponent />} />
        <Route path="/progress" element={<h1>Test</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
