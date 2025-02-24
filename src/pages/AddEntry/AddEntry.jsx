import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddEntry() {
  const [title, setTitle] = useState("");
  const [sketch, setSketch] = useState("");
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSaving(true);
    const token = localStorage.getItem("accessToken");
    const entry = {
      title,
      sketch,
      text,
    };
    try {
      await axios.post("http://localhost:3030/api/entry/newentry", entry, {
        headers: { Authorization: "Bearer " + token },
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
    setIsSaving(false);
  };
  return (
    <>
      <div className="addentry">
        <div className="addentry__container">
          <h1>How are you feeling?</h1>
          <input
            className="addentry__title"
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
          ></input>
          <input
            className="addentry__sketch"
            type="text"
            value={sketch}
            placeholder="Sketch"
            onChange={(e) => setSketch(e.target.value)}
            disabled={isSaving}
          ></input>
          <textarea
            className="addentry__text"
            type="text"
            value={text}
            placeholder="Text"
            onChange={(e) => setText(e.target.value)}
            disabled={isSaving}
          ></textarea>
          <button
            className="addentry__submit"
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}

export default AddEntry;
