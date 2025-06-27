import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";

export default function DevicesDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3001/devices/${id}`)
      .then((res) => res.json())
      .then((data) => setDevice(data.device))
      .catch((error) => console.error(error));
  }, [id]);

  console.log(device);

  return (
    <Card>
      <Card.Body>
        <Card.Title>{device.title}</Card.Title>
        {device.media && device.media.length > 0 && (
          <Carousel
            style={{
              maxHeight: "500px",
              overflow: "hidden",
              background: "black",
            }}
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

        <ul>
          {Object.entries(device)
            .filter(([key]) => key !== "title")
            .map(([key, value]) => (
              <li key={key} className="d-flex justify-content-start">
                <strong>{key}:</strong>
                {["createdat", "updatedat"].includes(key.toLowerCase())
                  ? new Date(value).toLocaleDateString("it-IT")
                  : String(value)}
              </li>
            ))}
        </ul>
      </Card.Body>
    </Card>
  );
}
