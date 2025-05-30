import { useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("tutti");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [favoriteList, setFavoriteList] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch(`http://localhost:3001/devices`)
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteList)); //salva i preferiti e li trasforma in stringa
  }, [favoriteList]);

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
      <div className="d-flex justify-content-between align-items-start flex-wrap">
        <div className="d-flex">
          <input
            placeholder="Cerca il dispositivo..."
            className="mb-3 me-2"
            onChange={(e) => setSearchQuery(e.target.value)}
          />

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
        <div>
          <Link
            to="/favorites"
            state={{ favoriteList }}
            className="ms-2 mb-3 btn btn-primary btn-sm"
          >
            Vai alla sezione Preferiti <FontAwesomeIcon icon={faStar} />
          </Link>

          <Link
            to="/compare"
            state={{ devices }}
            className="ms-2 mb-3 btn btn-primary btn-sm"
          >
            Clicca per andare al comparatore
          </Link>
        </div>
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
              <td>
                <Button
                  onClick={() => {
                    setFavoriteList((prev) =>
                      prev.includes(d.id)
                        ? prev.filter((f) => f !== d.id)
                        : [...prev, d.id]
                    );
                  }}
                >
                  <FontAwesomeIcon
                    icon={favoriteList.includes(d.id) ? faStar : faStarRegular}
                  />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
