import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  Box,
  Button,
  Stack,
  Slider,
  IconButton,
  Typography,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

function Canvas({ canvasRef }) {
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState("#2d3235");
  const [brushSize, setBrushSize] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colours = ["#2d3235", "#ed6242", "#f5c848", "#388360", "#6593b4"];

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = isMobile ? 350 : 700;
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
    <Box alignItems="center" display="flex" flexDirection="column">
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        onTouchStart={startTouchDrawing}
        onTouchEnd={finishDrawing}
        onTouchMove={touchDraw}
        ref={canvasRef}
        style={{
          width: isMobile ? 350 : 700,
          height: "300px",
          touchAction: "none",
          borderRadius: "15px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          backgroundColor: "white",
        }}
      />
      <Box
        mt={1}
        justifyContent="space-between"
        display="flex"
        width={isMobile ? 350 : 700}
      >
        <Stack direction="row" gap={0.5}>
          {colours.map((colour) => (
            <IconButton
              key={colour}
              sx={{
                padding: 0,
                backgroundColor: brushColor === colour ? colour : "",
                "&:hover": {
                  backgroundColor: brushColor === colour ? colour : "",
                },
              }}
              onClick={() => setBrushColor(colour)}
            >
              <CircleIcon sx={{ color: colour, fontSize: 40 }} />
            </IconButton>
          ))}
        </Stack>

        {!isMobile && (
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            width="100%"
          >
            <Typography variant="body2" mr={1}>
              Brush Size
            </Typography>
            <Slider
              min={1}
              max={30}
              value={brushSize}
              onChange={(e, value) => setBrushSize(value)}
              sx={{
                width: 300,
              }}
            />
          </Box>
        )}

        <Button variant="outlined" onClick={clearSketch}>
          Clear
        </Button>
      </Box>
      {isMobile && (
        <Box display="flex" flexDirection="column" mt={2} width={350}>
          <Typography mr={1}>Brush Size</Typography>
          <Slider
            min={1}
            max={30}
            value={brushSize}
            onChange={(e, value) => setBrushSize(value)}
            width="100%"
          />
        </Box>
      )}
    </Box>
  );
}

export default Canvas;
