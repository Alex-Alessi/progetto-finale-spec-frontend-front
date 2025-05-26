import { useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("tutti");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:3001/devices`)
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error(error));
  }, []);

  const sortMemo = useMemo(() => {
    const filteredList =
      selectedOption === "tutti"
        ? devices.filter((d) =>
            d.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : devices
            .filter((d) => d.category === selectedOption)
            .filter((d) =>
              d.title.toLowerCase().includes(searchQuery.toLowerCase())
            );

    const devicesToSort = [...filteredList];

    if (sortBy === "title") {
      const titleOrdered = devicesToSort.sort(
        (a, b) =>
          (a.title || "")
            .toLowerCase()
            .localeCompare((b.title || "").toLowerCase()) * sortOrder
      );
      return titleOrdered;
    } else if (sortBy === "category") {
      const categoryOrdered = devicesToSort.sort(
        (a, b) =>
          (a.category || "")
            .toLowerCase()
            .localeCompare((b.category || "").toLowerCase()) * sortOrder
      );
      return categoryOrdered;
    }
    return devicesToSort;
  }, [devices, searchQuery, selectedOption, sortOrder, sortBy]);

  function handleSort(column) {
    if (sortBy === column) {
      if (sortOrder == 1) {
        setSortOrder(-1);
      } else {
        setSortOrder(1);
      }
    } else {
      setSortBy(column);
      setSortOrder(1);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-start">
        <input
          placeholder="Cerca il dispositivo..."
          className="mb-3 me-2"
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>

        <Form.Select
          style={{ width: "200px" }}
          size="sm"
          aria-label="Default select example"
          className="mb-3"
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="tutti">Tutti</option>
          <option value="smartphone">Smartphone</option>
          <option value="smartwatch">Smartwatch</option>
          <option value="laptop">Laptop</option>
          <option value="tablet">Tablet</option>
        </Form.Select>
      </div>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th onClick={() => handleSort("title")}>Title</th>
            <th onClick={() => handleSort("category")}>Category</th>
            <th>createdAt</th>
          </tr>
        </thead>
        <tbody>
          {sortMemo.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>
                <Link to={`/devices/${d.id}`}>{d.title}</Link>
              </td>
              <td>{d.category}</td>
              <td>{new Date(d.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
