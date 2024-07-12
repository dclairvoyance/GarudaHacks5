import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import Articles from "./pages/Articles";
import ChatBot from "./pages/Chatbot";
import HomePage from "./pages/Homepage";
import TrackerComponent from "./pages/Tracker";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<h1>Test</h1>} />
        <Route path="/consultation" element={<ChatBot />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/tracker" element={<TrackerComponent />} />
        <Route path="/progress" element={<h1>Test</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
