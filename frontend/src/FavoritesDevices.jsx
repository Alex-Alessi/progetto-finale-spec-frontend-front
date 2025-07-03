import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import Form from "react-bootstrap/Form";
import { faAndroid } from "@fortawesome/free-brands-svg-icons";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { faWindows } from "@fortawesome/free-brands-svg-icons";
import { SiGarmin } from "react-icons/si";
import { useNavigate } from "react-router-dom";

export default function FavoritesDevices() {
  const [devices, setDevices] = useState([]);
  const [favoriteList, setFavoriteList] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectFormat, setSelectFormat] = useState("griglia");
  const navigate = useNavigate();
  const [fullImg, setFullImg] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/devices`)
      .then((res) => res.json())
      .then((data) => setDevices(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favoriteList)); //salva i preferiti e li trasforma in stringa
  }, [favoriteList]);

  function foundCategory(category) {
    if (category === "smartphone") return "badge text-bg-info";
    else if (category === "laptop") return "badge text-bg-warning";
    else if (category === "tablet") return "badge text-black text-bg-success";
    else return "badge text-black text-bg-primary";
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

  return (
    <div>
      <div className="d-flex mt-3">
        <h1 className="w-50 mx-auto mb-4">Lista preferiti</h1>
        <Form.Select
          aria-label="Categoria"
          className={`custom-select-transition ${
            isExpanded ? "expanded" : ""
          } me-2`}
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
      {selectFormat === "griglia" ? (
        <div className="container">
          <div className="row">
            {devices
              .filter((f) => favoriteList.includes(f.id))
              .map((d) => {
                const imgSrc =
                  d.media && Array.isArray(d.media) && d.media.length > 1
                    ? `/${d.media[1]}`
                    : null;
                return (
                  <div key={d.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div
                      className="card h-100 "
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
                            onClick={(e) => {
                              e.stopPropagation();
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
                              {d.storage
                                ? `${d.title} ${d.storage}GB`
                                : d.title}
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
      ) : favoriteList.length == 0 ? (
        <h2>Non ci sono elementi nei preferiti</h2>
      ) : (
        <Table bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Operating System</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {devices
              .filter((f) => favoriteList.includes(f.id))
              .map((d) => (
                <tr key={d.id}>
                  <td>
                    <Link to={`/devices/${d.id}`} className="text-dark">
                      {d.title}
                    </Link>
                  </td>
                  <td>
                    <p className={foundCategory(d.category)}>{d.category}</p>
                  </td>
                  <td>
                    {iconOs(d.os)}
                    {d.os}
                  </td>
                  <td>
                    <strong>€ {d.price.toFixed(2).replace(".", ",")}</strong>
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
                          favoriteList.includes(d.id)
                            ? solidHeart
                            : regularHeart
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
