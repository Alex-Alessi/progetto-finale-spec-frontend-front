import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";

export default function DevicesDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/devices/${id}`)
      .then((res) => res.json())
      .then((data) => setDevice(data.device))
      .catch((error) => console.error(error));
  }, [id]);

  console.log(device);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <div className={show ? "blur-background" : ""}>
        <h1>{device.title}</h1>
        {device.media && device.media.length > 0 && (
          <Carousel
            style={{
              maxHeight: "500px",
              overflow: "hidden",
              background: "black",
            }}
            className="my-4"
          >
            {device.media.map((file, index) => (
              <Carousel.Item key={index}>
                <img
                  src={`/${file}`}
                  alt={`media-${index}`}
                  className="d-block mx-auto img-fluid"
                  style={{
                    maxHeight: "500px",
                    objectFit: "contain",
                    width: "100%",
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}

        <Button variant="primary" onClick={handleShow}>
          Specifiche
        </Button>
      </div>
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Specifiche Tecniche</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul>
            {Object.entries(device)
              .filter(
                ([key]) => key !== "title" && key !== "media" && key !== "id"
              )
              .map(([key, value]) => (
                <li key={key}>
                  <strong>{key}: </strong>
                  {["createdat", "updatedat"].includes(key.toLowerCase())
                    ? new Date(value).toLocaleDateString("it-IT")
                    : String(value)}
                </li>
              ))}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
