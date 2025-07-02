import { useCallback, useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { faWindows } from "@fortawesome/free-brands-svg-icons";
import { SlScreenSmartphone } from "react-icons/sl";
import { MdComputer } from "react-icons/md";
import { FaTabletAlt } from "react-icons/fa";
import { BsSmartwatch } from "react-icons/bs";
import { SiGarmin } from "react-icons/si";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

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
  const [isHover, setIsHover] = useState("");
  const navigate = useNavigate();
  const [fullImg, setFullImg] = useState(null);

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
    if (os.toLowerCase().includes("android")) {
      return (
        <FontAwesomeIcon
          icon={faAndroid}
          style={{ color: "#78c258" }}
          className="me-1"
        />
      );
    } else if (
      os.toLowerCase().includes("ios") ||
      os.toLowerCase().includes("macos") ||
      os.toLowerCase().includes("watchos") ||
      os.toLowerCase().includes("ipados")
    ) {
      return (
        <FontAwesomeIcon
          icon={faApple}
          style={{ color: "#000000" }}
          className="me-1"
        />
      );
    } else if (os.toLowerCase().includes("windows")) {
      return (
        <FontAwesomeIcon
          icon={faWindows}
          style={{ color: "#005eff" }}
          className="me-1"
        />
      );
    } else if (os.toLowerCase().includes("garmin")) {
      return <SiGarmin className="me-1" />;
    }
  }

  useEffect(() => {
    fetch(`http://localhost:3001/devices`)
      .then((res) => res.json())
      .then((data) => {
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
            selectedOption === "smartphone" ? "info" : "outline-secondary"
          }
          style={{
            backgroundColor: isHover === "smartphone" ? "#0cb7d9" : "",
          }}
          className="mx-4 category-button"
          onClick={() => handleCategoryClick("smartphone")}
          onMouseEnter={() => setIsHover("smartphone")}
          onMouseLeave={() => setIsHover("")}
        >
          <SlScreenSmartphone /> Smartphone
        </Button>

        <Button
          variant={
            selectedOption === "laptop" ? "warning" : "outline-secondary"
          }
          style={{ backgroundColor: isHover === "laptop" ? "#ffc107" : "" }}
          className="mx-4 category-button"
          onClick={() => handleCategoryClick("laptop")}
          onMouseEnter={() => setIsHover("laptop")}
          onMouseLeave={() => setIsHover("")}
        >
          <MdComputer /> Laptop
        </Button>

        <Button
          variant={
            selectedOption === "tablet" ? "success" : "outline-secondary"
          }
          style={{
            backgroundColor: isHover === "tablet" ? "#198754" : "",
            color: selectedOption === "tablet" ? "black" : "",
          }}
          className="mx-4 category-button"
          onClick={() => handleCategoryClick("tablet")}
          onMouseEnter={() => setIsHover("tablet")}
          onMouseLeave={() => setIsHover("")}
        >
          <FaTabletAlt /> Tablet
        </Button>

        <Button
          variant={
            selectedOption === "smartwatch" ? "primary" : "outline-secondary"
          }
          style={{
            backgroundColor: isHover === "smartwatch" ? "#0d6efd" : "",
            color: selectedOption === "smartwatch" ? "black" : "",
          }}
          className="mx-4 category-button"
          onClick={() => handleCategoryClick("smartwatch")}
          onMouseEnter={() => setIsHover("smartwatch")}
          onMouseLeave={() => setIsHover("")}
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
                  <div
                    className="card h-100"
                    onClick={() => navigate(`/devices/${d.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div>
                        <p className="card-text position-absolute top-0 start-0 m-2">
                          <span className={foundCategory(d.category)}>
                            {d.category}
                          </span>
                        </p>
                        <Button
                          variant="outline-secondary"
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
                        <h5
                          className="card-title text-center"
                          style={{ fontSize: "18px" }}
                        >
                          <Link
                            to={`/devices/${d.id}`}
                            className="custom-link d-flex align-items-start justify-content-center"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            {d.storage ? `${d.title} ${d.storage}GB` : d.title}
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
                              cursor: "zoom-in",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullImg(imgSrc);
                            }}
                          />
                        )}
                        <p>
                          {iconOs(d.os)}
                          {d.os}
                        </p>
                        <b>€ {d.price.toFixed(2).replace(".", ",")}</b>
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            fontSize: "12px",
                            borderRadius: "10px",
                            width: "200px",
                          }}
                          className="bg-secondary-subtle text-secondary-emphasis mt-2"
                        >
                          oppure{" "}
                          <strong>
                            € {(d.price / 3).toFixed(2).replace(".", ",")}
                          </strong>{" "}
                          al mese in 3 rate
                        </div>
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
              <th>Operating System</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {sortMemo.map((d) => (
              <tr key={d.id}>
                <td>
                  <Link to={`/devices/${d.id}`} className="custom-link">
                    {d.title}
                  </Link>
                </td>
                <td>
                  <p className={foundCategory(d.category)}>{d.category}</p>
                </td>
                <td>
                  {" "}
                  {iconOs(d.os)}
                  {d.os}
                </td>
                <td>
                  <strong>
                    € {(d.price / 3).toFixed(2).replace(".", ",")}
                  </strong>
                </td>
                <td>
                  <Button
                    variant="outline-secondary"
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
                        favoriteList.includes(d.id) ? solidHeart : regularHeart
                      }
                      style={{ color: "#ff0000" }}
                    />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {fullImg && (
        <div
          onClick={() => setFullImg(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={fullImg}
            alt="Fullscreen"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0 0 20px black",
            }}
          />
        </div>
      )}
    </div>
  );
}
