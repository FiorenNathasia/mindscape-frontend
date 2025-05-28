import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import Canvas from "../../components/Canvas/Canvas";

function EntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  //States//
  const [title, setTitle] = useState("");
  const [sketch, setSketch] = useState("");
  const [text, setText] = useState("");
  const [isEditingSketch, setIsEditingSketch] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntryData = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/entry/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setTitle(data.data.title);
      setSketch(data.data.sketch);
      setText(data.data.text);
      setIsEditingSketch(!data.data.sketch);
    } catch (error) {
      // TODO: handle error
      console.log(error);
    }
  };

  const fetchPageData = async () => {
    await fetchEntryData();
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const startSketchEditing = () => {
    setSketch("");
    setIsEditingSketch(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    let newSketch = sketch;
    if (isEditingSketch) {
      newSketch = canvasRef.current.toDataURL();
    }

    const token = localStorage.getItem("accessToken");
    const editedFields = {
      title,
      sketch: newSketch,
      text,
    };

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/entry/${id}`,
        editedFields,
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

  const handleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/entry/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <LinearProgress width="100%" />;

  return (
    <>
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
            <Typography variant="h4">Update Entry</Typography>

            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
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

          {isEditingSketch || !sketch ? (
            <>
              <Canvas canvasRef={canvasRef} />
            </>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <img
                style={{
                  borderRadius: "15px",
                  marginBottom: "5px",
                }}
                src={sketch}
                alt="Sketch"
              />
              <Button
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
                onClick={startSketchEditing}
              >
                Create New Sketch
              </Button>
            </Box>
          )}

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
        <Button variant="contained" onClick={handleSave}>
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

export default EntryPage;
