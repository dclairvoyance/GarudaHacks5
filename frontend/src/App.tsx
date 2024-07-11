import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Test</h1>}>
          <Route path="/login" element={<h1>Test</h1>} />
          <Route path="/register" element={<h1>Test</h1>} />
          <Route path="/consultation" element={<h1>Test</h1>} />
          <Route path="/tracker" element={<h1>Test</h1>} />
          <Route path="/progress" element={<h1>Test</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
