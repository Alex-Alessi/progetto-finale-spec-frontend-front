import { Routes, Route, BrowserRouter, Link } from "react-router-dom";
import "./App.css";
import DevicesPage from "./DevicesPage";
import DevicesDetail from "./DevicesDetail";
import DevicesComparator from "./DevicesComparator";
import FavoritesDevices from "./FavoritesDevices";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar expand="lg" className="bg-body-secondary w-100">
        <Navbar.Brand>
          <img
            src={"/responsive.png"}
            style={{
              maxHeight: "30px",
            }}
            className="me-2"
          />
          Tech Shop
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/compare">
              Comparatore
            </Nav.Link>
            <Nav.Link as={Link} to="/favorites">
              Preferiti
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
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
