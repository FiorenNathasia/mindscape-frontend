import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Entry({ id, title, date, sketch, text, fetchEntries }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const token = localStorage.getItem("accessToken");
    try {
      const deletedEntry = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/entry/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      await fetchEntries();
    } catch (error) {
      console.log(error);
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Link style={{ color: "black" }} to={`/entry/${id}`}>
        <p className="entry__title">{title}</p>
      </Link>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </>
  );
}

export default Entry;
