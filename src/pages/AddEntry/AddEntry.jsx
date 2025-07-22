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
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "../../components/Header/Header";

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

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ paddingTop: 5 }}>
        <Box mb={3}>
          <Box
            display="flex"
            justifyContent="center"
            flexDirection="row"
            mb={3}
            width="100%"
            alignItems="center"
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
    </>
  );
}

export default AddEntry;
