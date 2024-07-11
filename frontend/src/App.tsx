import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import ChatBot from "./pages/Chatbot";
import HomePage from "./pages/Homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<h1>Test</h1>} />
        <Route path="/consultation" element={<ChatBot />} />
        <Route path="/tracker" element={<h1>Test</h1>} />
        <Route path="/progress" element={<h1>Test</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
