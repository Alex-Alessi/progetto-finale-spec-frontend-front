import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import DevicesPage from "./DevicesPage";
import DevicesDetail from "./DevicesDetail";
import DevicesComparator from "./DevicesComparator";
import FavoritesDevices from "./FavoritesDevices";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DevicesPage />} />
        <Route path="/devices/:id" element={<DevicesDetail />} />
        <Route path="/compare" element={<DevicesComparator />} />
        <Route path="/favorites" element={<FavoritesDevices />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
