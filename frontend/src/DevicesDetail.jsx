import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";

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
