import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export default function DevicesComparator() {
  const [devices, setDevices] = useState([]);
  const [idDevice1, setIdDevice1] = useState("");
  const [idDevice2, setIdDevice2] = useState("");
  const [device1, setDevice1] = useState({});
  const [device2, setDevice2] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3001/devices`)
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error(error));
  }, []);

  function handleClick() {
    if (
      idDevice1 === "default" ||
      idDevice2 === "default" ||
      !idDevice1 ||
      !idDevice2 ||
      idDevice1 === idDevice2
    ) {
      alert("Devi selezionare due dispositivi diversi");
      return;
    }

    const id1 = parseInt(idDevice1);
    const id2 = parseInt(idDevice2);

    fetch(`http://localhost:3001/devices/${id1}`)
      .then((res) => res.json())
      .then((data) => setDevice1(data.device))
      .catch((error) => console.error(error));

    fetch(`http://localhost:3001/devices/${id2}`)
      .then((res) => res.json())
      .then((data) => setDevice2(data.device))
      .catch((error) => console.error(error));
  }

  function parametersList(dev1, dev2) {
    const keys1 = Object.keys(dev1);
    const keys2 = Object.keys(dev2);
    const keys = [...new Set(keys1.concat(keys2))];
    return keys;
  }

  return (
    <div className="bg-wrapper">
      {device1.media && (
        <div
          className="bg-half bg-left"
          style={{
            backgroundImage: `url(${device1.media[1]})`,
          }}
        />
      )}

      {device2.media && (
        <div
          className="bg-half bg-right"
          style={{
            backgroundImage: `url(${device2.media[1]})`,
          }}
        />
      )}

      <div className="content-overlay">
        <h2 className="mb-4">Scegli i due dispositivi da comparare</h2>

        <div className="d-flex justify-content-around mb-3">
          <Form.Select
            style={{ width: "300px" }}
            onChange={(e) => setIdDevice1(e.target.value)}
          >
            <option value="default">Seleziona il dispositivo</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            style={{ width: "300px" }}
            onChange={(e) => setIdDevice2(e.target.value)}
          >
            <option value="default">Seleziona il dispositivo</option>
            {devices.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </Form.Select>
        </div>

        <Button className="mb-3" onClick={handleClick}>
          Avvia il confronto
        </Button>
        <div>
          {device1.category !== device2.category ? (
            <Badge bg="" className="badgeComparator p-2 ">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                style={{ color: "#FFD43B" }}
                className="me-2"
              />
              Stai facendo un confronto tra categorie diverse
            </Badge>
          ) : (
            ""
          )}
        </div>

        <Table bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Parametri</th>
              <th>{device1.title}</th>
              <th>{device2.title}</th>
            </tr>
          </thead>
          <tbody>
            {parametersList(device1, device2)
              .filter((p) => p !== "title" && p !== "id" && p !== "media")
              .map((par) => (
                <tr key={par}>
                  <td>{par}</td>
                  <td>
                    {par === "price" && typeof device1[par] === "number"
                      ? "€ " + String(device1[par].toFixed(2).replace(".", ","))
                      : Object.keys(device1).includes(par)
                      ? String(device1[par])
                      : ""}
                  </td>
                  <td>
                    {par === "price" && typeof device2[par] === "number"
                      ? "€ " + String(device2[par].toFixed(2).replace(".", ","))
                      : Object.keys(device2).includes(par)
                      ? String(device2[par])
                      : ""}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
