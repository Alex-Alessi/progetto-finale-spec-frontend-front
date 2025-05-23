import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import DevicesPage from "./DevicesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DevicesPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
