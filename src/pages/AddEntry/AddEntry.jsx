import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Canvas from "../../components/Canvas/Canvas";

function AddEntry() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const handleSubmit = async () => {
    const sketchDataURL = canvasRef.current.toDataURL("image/png");
    console.log(sketchDataURL);
    setIsSaving(true);
    const token = localStorage.getItem("accessToken");
    const entry = {
      title,
      sketch: sketchDataURL,
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

  const back = () => {
    navigate("/");
  };

  return (
    <>
      <div className="addentry">
        <div className="addentry__container">
          <button onClick={back}>x</button>
          <h1>How are you feeling?</h1>
          <input
            className="addentry__title"
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSaving}
          ></input>
          <Canvas canvasRef={canvasRef} />
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
