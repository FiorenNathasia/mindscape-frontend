import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Canvas from "../../components/Canvas/Canvas";

function AddEntry() {
  const [title, setTitle] = useState("");
  const [sketch, setSketch] = useState("");
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  //Canvas
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  //Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 200;
    canvas.height = 180;

    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };
  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
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
          <canvas
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            ref={canvasRef}
          />
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
