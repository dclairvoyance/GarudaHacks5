import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<a href="/login"> login </a>}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<h1>Test</h1>} />
          <Route path="/consultation" element={<h1>Test</h1>} />
          <Route path="/tracker" element={<h1>Test</h1>} />
          <Route path="/progress" element={<h1>Test</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
