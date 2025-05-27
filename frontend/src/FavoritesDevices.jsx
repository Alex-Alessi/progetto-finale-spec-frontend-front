import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

export default function FavoritesDevices() {
  const [devices, setDevices] = useState([]);
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

  return (
    <div>
      <h1>Lista preferiti</h1>
      {favoriteList.length == 0 ? (
        <h2>Non ci sono elementi nei preferiti</h2>
      ) : (
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
            {devices
              .filter((f) => favoriteList.includes(f.id))
              .map((d) => (
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
