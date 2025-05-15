import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Entry({ id, title, sketch, fetchEntries }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/entry/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      await fetchEntries();
    } catch (error) {
      console.log(error);
    }
    setIsDeleting(false);
  };

  return (
    <div style={{ display: "flex", border: "1px solid black" }}>
      <Link style={{ color: "black" }} to={`/entry/${id}`}>
        <p className="entry__title">{title}</p>
      </Link>
      <img width={100} height="auto" src={sketch} alt="Sketch" />
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}

export default Entry;
