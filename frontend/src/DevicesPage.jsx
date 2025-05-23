import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:3001/devices`)
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <Table bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Title</th>
          <th>Category</th>
          <th>createdAt</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((d) => (
          <tr key={d.id}>
            <td>{d.id}</td>
            <td>{d.title}</td>
            <td>{d.category}</td>
            <td>{new Date(d.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
