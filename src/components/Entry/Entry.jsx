import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Entry({ id, title, date, sketch, entry, fetchEntries }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(false);
    const token = localStorage.getItem("accessToken");
    try {
      const deletedEntry = await axios.delete(
        `http://localhost:3030/api/entry/${id}`,
        {
          header: {
            headers: {
              Authorization: "Bearer " + token,
            },
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
        {title}
      </Link>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </>
  );
}

export default Entry;
