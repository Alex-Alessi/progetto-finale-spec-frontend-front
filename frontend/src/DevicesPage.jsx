import { useCallback, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { SlScreenSmartphone } from "react-icons/sl";
import { MdComputer } from "react-icons/md";
import { FaTabletAlt } from "react-icons/fa";
import { BsSmartwatch } from "react-icons/bs";
import Form from "react-bootstrap/Form";

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState(1);
  const [favoriteList, setFavoriteList] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectFormat, setSelectFormat] = useState("griglia");

  function debounce(callback, delay) {
    let timer;
    return (value) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback(value);
      }, delay);
    };
  }

  function foundCategory(category) {
    if (category === "smartphone") return "badge text-bg-info";
    else if (category === "laptop") return "badge text-bg-warning";
    else if (category === "tablet") return "badge text-black text-bg-success";
    else return "badge text-black text-bg-primary";
  }

  function handleCategoryClick(category) {
    setSelectedOption((prev) => (prev === category ? null : category));
  }

  function iconOs(os) {
    if (os.toLowerCase() === "android") {
      return <FontAwesomeIcon icon={faAndroid} style={{ color: "#78c258" }} />;
    } else if (
      os.toLowerCase() === "ios" ||
      os.toLowerCase() === "macos" ||
      os.toLowerCase() === "watchos" ||
      os.toLowerCase() === "ipados"
    ) {
      return <FontAwesomeIcon icon={faApple} style={{ color: "#000000" }} />;
    }
  }

  useEffect(() => {
    fetch(`http://localhost:3001/devices`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dati caricati dal server:", data); // <-- debug
        setDevices(data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteList)); //salva i preferiti e li trasforma in stringa
  }, [favoriteList]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  const sortMemo = useMemo(() => {
    const filteredList = !selectedOption
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
    <div className="mt-3 ">
      <div className="d-flex">
        <input
          type="text"
          placeholder="Cerca il dispositivo..."
          className="form-control rounded-pill w-50 mb-3 mx-auto"
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ minWidth: "300px" }}
        />

        <Form.Select
          aria-label="Categoria"
          className={`custom-select-transition ${isExpanded ? "expanded" : ""}`}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
          defaultValue=""
          onChange={(e) => {
            setSelectFormat(e.target.value);
          }}
        >
          <option value="griglia">Griglia</option>
          <option value="lista">Lista</option>
        </Form.Select>
      </div>
      <div className="d-flex justify-content-center flex-wrap mb-4">
        <Button
          variant={
            selectedOption === "smartphone" ? "primary" : "outline-secondary"
          }
          className="mx-4"
          onClick={() => handleCategoryClick("smartphone")}
        >
          <SlScreenSmartphone /> Smartphone
        </Button>

        <Button
          variant={
            selectedOption === "laptop" ? "primary" : "outline-secondary"
          }
          className="mx-4"
          onClick={() => handleCategoryClick("laptop")}
        >
          <MdComputer /> Laptop
        </Button>

        <Button
          variant={
            selectedOption === "tablet" ? "primary" : "outline-secondary"
          }
          className="mx-4"
          onClick={() => handleCategoryClick("tablet")}
        >
          <FaTabletAlt /> Tablet
        </Button>

        <Button
          variant={
            selectedOption === "smartwatch" ? "primary" : "outline-secondary"
          }
          className="mx-4"
          onClick={() => handleCategoryClick("smartwatch")}
        >
          <BsSmartwatch /> Smartwatch
        </Button>
      </div>

      {selectFormat === "griglia" ? (
        <div className="container">
          <div className="row">
            {sortMemo.map((d) => {
              const imgSrc =
                d.media && Array.isArray(d.media) && d.media.length > 1
                  ? `/${d.media[1]}`
                  : null;
              return (
                <div key={d.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div>
                        <p className="card-text position-absolute top-0 start-0 m-2">
                          <span className={foundCategory(d.category)}>
                            {d.category}
                          </span>
                        </p>
                        <Button
                          variant="outline-primary"
                          onClick={() => {
                            setFavoriteList((prev) =>
                              prev.includes(d.id)
                                ? prev.filter((f) => f !== d.id)
                                : [...prev, d.id]
                            );
                          }}
                          className="btn-sm position-absolute top-0 end-0 m-2"
                        >
                          <FontAwesomeIcon
                            icon={
                              favoriteList.includes(d.id)
                                ? solidHeart
                                : regularHeart
                            }
                            style={{ color: "#ff0000" }}
                          />
                        </Button>
                        <h5 className="card-title text-center">
                          <Link
                            to={`/devices/${d.id}`}
                            className="custom-link d-flex align-items-start justify-content-center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {d.title}
                          </Link>
                        </h5>

                        {imgSrc && (
                          <img
                            src={imgSrc}
                            alt={d.title}
                            className="d-block mx-auto img-fluid mb-3"
                            style={{
                              width: "200px",
                              height: "150px",
                              objectFit: "cover",
                              marginTop: "10px",
                            }}
                          />
                        )}
                        <p>
                          {iconOs(d.os)}
                          {d.os}
                        </p>
                        <p>
                          <b>Storage: </b>
                          {d.storage}GB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Table bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort("title")}>Title</th>
              <th onClick={() => handleSort("category")}>Category</th>
              <th>createdAt</th>
            </tr>
          </thead>
          <tbody>
            {sortMemo.map((d) => (
              <tr key={d.id}>
                <td>
                  <Link to={`/devices/${d.id}`}>{d.title}</Link>
                </td>
                <td>
                  <p className={foundCategory(d.category)}>{d.category}</p>
                </td>
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
                      icon={
                        favoriteList.includes(d.id) ? faStar : faStarRegular
                      }
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
