import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Canvas from "../../components/Canvas/Canvas";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
  CircularProgress,
} from "@mui/material";

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
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/entry/newentry`,
        entry,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
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
    <Container maxWidth="md" sx={{ paddingTop: 5 }}>
      <Box mb={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection="row"
          mb={3}
          width="100%"
          alignItems="flex-start"
        >
          <Typography variant="h4">How are you feeling?</Typography>
        </Box>
      </Box>
      <Stack direction="column" gap={3} width="100%" mt={2} mb={2}>
        <Box>
          <Typography variant="caption" color="textSecondary">
            Title
          </Typography>
          <TextField
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Box>

        <Canvas canvasRef={canvasRef} />

        <Box>
          <Typography variant="caption" color="textSecondary">
            Body
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            value={text}
            minRows={4}
            onChange={(e) => setText(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
        </Box>
      </Stack>
      <Button variant="contained" onClick={handleSubmit}>
        Save
        {isSaving && (
          <CircularProgress
            sx={{ marginLeft: 1 }}
            size="1rem"
            color="secondary"
          />
        )}
      </Button>
    </Container>
  );

  // return (
  //   <>
  //     <div className="addentry">
  //       <div className="addentry__container">
  //         <button onClick={back}>x</button>
  //         <h1>How are you feeling?</h1>
  //         <input
  //           className="addentry__title"
  //           type="text"
  //           value={title}
  //           placeholder="Title"
  //           onChange={(e) => setTitle(e.target.value)}
  //           disabled={isSaving}
  //         ></input>
  //         <Canvas canvasRef={canvasRef} />
  //         <textarea
  //           className="addentry__text"
  //           type="text"
  //           value={text}
  //           placeholder="Text"
  //           onChange={(e) => setText(e.target.value)}
  //           disabled={isSaving}
  //         ></textarea>
  //         <button
  //           className="addentry__submit"
  //           onClick={handleSubmit}
  //           disabled={isSaving}
  //         >
  //           {isSaving ? "Saving..." : "Save"}
  //         </button>
  //       </div>
  //     </div>
  //   </>
  // );
}

export default AddEntry;
