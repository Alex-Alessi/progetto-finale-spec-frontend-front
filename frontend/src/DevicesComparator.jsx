import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useLocation } from "react-router-dom";
import Table from "react-bootstrap/Table";

export default function DevicesComparator() {
  const location = useLocation();
  const { devices } = location.state;
  const [idDevice1, setIdDevice1] = useState("");
  const [idDevice2, setIdDevice2] = useState("");
  const [device1, setDevice1] = useState({});
  const [device2, setDevice2] = useState({});

  function handleClick() {
    if (
      idDevice1 !== "default" &&
      idDevice2 !== "default" &&
      idDevice1 !== idDevice2
    ) {
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
    } else {
      alert("Devi selezionare due dispositivi diversi");
    }
  }

  function parametersList(dev1, dev2) {
    const keys1 = Object.keys(dev1);
    const keys2 = Object.keys(dev2);
    const keys = [...new Set(keys1.concat(keys2))];
    return keys;
  }

  return (
    <div>
      <h2 className="mb-4">Scegli i due dispositivi da comparare</h2>
      <div className="d-flex justify-content-around">
        <Form.Select
          style={{ width: "300px" }}
          aria-label="Default select example"
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
          aria-label="Default select example"
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
      <Button className="mt-3" onClick={handleClick}>
        Avvia il confronto
      </Button>
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
            .filter((p) => p !== "title" && p !== "id")
            .map((par) => (
              <tr key={par}>
                <td>{par}</td>
                <td>
                  {Object.keys(device1).includes(par)
                    ? String(device1[par])
                    : ""}
                </td>
                <td>
                  {Object.keys(device2).includes(par)
                    ? String(device2[par])
                    : ""}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
}
