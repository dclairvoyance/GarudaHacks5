import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import Articles from "./pages/Articles";
import ChatBot from "./pages/Chatbot";
import HomePage from "./pages/Homepage";
import TrackerComponent from "./pages/Tracker";
import RegisterPage from "./pages/Register";
import ConnectPages from "./pages/Connect";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/consultation" element={<ChatBot />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/connect" element={<ConnectPages />} />
        <Route path="/tracker" element={<TrackerComponent />} />
        <Route path="/progress" element={<h1>Test</h1>} />
      </Routes>
      <Toaster position="bottom-right" reverseOrder={false} />
    </BrowserRouter>
  );
}

export default App;
