import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import DevicesPage from "./DevicesPage";
import DevicesDetail from "./DevicesDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DevicesPage />} />
        <Route path="/devices/:id" element={<DevicesDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
