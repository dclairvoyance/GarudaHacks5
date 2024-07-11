import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<a>login </a>}></Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<h1>Test</h1>} />
          <Route path="/consultation" element={<h1>Test</h1>} />
          <Route path="/tracker" element={<h1>Test</h1>} />
          <Route path="/progress" element={<h1>Test</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
