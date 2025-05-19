import { useEffect, useRef, useState } from "react";

function Canvas({ canvasRef }) {
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 500;
    canvas.height = 300;

    const context = canvas.getContext("2d");
    context.lineCap = "round";

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;
  }, []);

  const startTouchDrawing = (e) => {
    e.preventDefault(); // Prevent mobile scrolling
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.strokeStyle = brushColor;
    contextRef.current.lineWidth = brushSize;
    setIsDrawing(true);
  };

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    contextRef.current.strokeStyle = brushColor;
    contextRef.current.lineWidth = brushSize;
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    e.preventDefault(); // Prevent mobile scrolling
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const touchDraw = (e) => {
    e.preventDefault(); // Prevent mobile scrolling
    if (!isDrawing) {
      return;
    }
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;

    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearSketch = () => {
    const canvas = canvasRef.current;
    contextRef.current.fillStyle = "white";
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onTouchStart={startTouchDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={touchDraw}
        ref={canvasRef}
        style={{
          border: "1px solid black",
          width: "500px",
          height: "300px",
          touchAction: "none",
        }}
      />
      <input
        type="color"
        value={brushColor}
        onChange={(e) => setBrushColor(e.target.value)}
      />
      <input
        type="range"
        min="1"
        max="20"
        value={brushSize}
        onChange={(e) => setBrushSize(e.target.value)}
      />
      <button onClick={clearSketch}>Clear</button>
    </div>
  );
}

export default Canvas;
