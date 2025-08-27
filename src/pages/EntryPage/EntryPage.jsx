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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import Canvas from "../../components/Canvas/Canvas";
import Header from "../../components/Header/Header";

function EntryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [title, setTitle] = useState("");
  const [sketch, setSketch] = useState("");
  const [text, setText] = useState("");
  const [aiTags, setAiTags] = useState([]);
  const [manualTags, setManualTags] = useState([]);
  const [openAiDialog, setOpenAiDialog] = useState(false);
  const [manualTagInput, setManualTagInput] = useState("");
  const [isEditingSketch, setIsEditingSketch] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedEntryId, setSavedEntryId] = useState(null);

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
      //Give the tags from the response data to the state manualTags
      //If there is no tags, return an empty array
      setManualTags(data.tags || []);
      setIsEditingSketch(!data.data.sketch);
      console.log("Entry response:", data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPageData = async () => {
    await fetchEntryData();
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPageData();
  }, [id]);

  const startSketchEditing = () => {
    setSketch("");
    setIsEditingSketch(true);
  };

  // Handles adding a tag when the user presses Enter
  const handleAddManualTag = (e) => {
    // If Enter is pressed and input is not empty
    if (e.key === "Enter" && manualTagInput.trim()) {
      // Add the trimmed input as a new tag
      setManualTags((prev) => [...prev, manualTagInput.trim()]);
      // Clear the input field
      setManualTagInput("");
    }
  };

  //Handles deleting existing tags
  const handleDeleteTag = async (tagToDelete) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/entry/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { tag: tagToDelete }, // send tag info
      });
      //Accesses the array of tags
      //It filters out the tags that is chosen (as tagToRemove) from the manualTags array
      setManualTags((prev) => prev.filter((tag) => tag !== tagToDelete));
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  //Handles removing aiTags
  const handleRemoveAiTag = (tagToRemove) => {
    //Accesses the array of aiTags
    //It filters out the tags that is chosen (as tagToRemove) from the aiTags array
    setAiTags((prev) => prev.filter((t) => t !== tagToRemove));
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
      //Include the newly changed manualTags into the edited fields
      manualTags,
    };

    try {
      //Send a PUT request with all the editedFields set above
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/entry/${id}`,
        editedFields,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      //From the data response, access the id of the current entry
      setSavedEntryId(data.data.id);
      //Put in the aiTags state the aiTags from the data response
      setAiTags(data.aiTags);
      console.log("AI Tags returned:", data.aiTags);

      //If there are aiTags from the data response
      if (data.aiTags?.length > 0) {
        //Open the ai dialog
        setOpenAiDialog(true);
      } else {
        //If there is not, just go to the homepage
        navigate("/");
      }
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

  //Handle adding the ai tags
  const handleAcceptAiTags = async () => {
    //Get the token for the current user
    const token = localStorage.getItem("accessToken");
    try {
      //Send a POST request for the manualTags and aiTags array to the endpoint that handles saving the tags
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/entry/${savedEntryId}/tags`,
        { manualTags, aiTags },
        { headers: { Authorization: "Bearer " + token } }
      );
      //Once the request is sent, close the ai dialog
      setOpenAiDialog(false);
      //Then go to the homepage
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <LinearProgress width="100%" />;

  return (
    <>
      <Header />
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
          <Box>
            <Typography variant="subtitle1">Tags</Typography>
            {/*Textfield to add the tags
            1.Make the value of the text field the state manualTagInput that is empty
            2.When it changes, change the state of setManualTagInput(the even handler) 
            should be the value entered in the textfield  
            3.This allows to add the tag by pressing enter 
            which we have set in the function handleAddManualTag */}
            <TextField
              placeholder="Add a tag and press Enter"
              value={manualTagInput}
              onChange={(e) => setManualTagInput(e.target.value)}
              onKeyDown={handleAddManualTag}
              fullWidth
              variant="outlined"
            />
            <Box mt={1} display="flex" flexWrap="wrap" gap={1}>
              {/*When there is a tag in the manualTags state,
              1.Map through the array,
              2.And each tag is put into a chip
              3.Set the key and label of the tag to the chip
              4.And for the onDelete, use the function handleDeleteTag for this specific tag*/}
              {manualTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
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
      {/*This is the dialog that is triggered when after the save button
          1. You set the openAiDialog as open
          2. It will go through the array of aiTags 
          3. Each tag will be put in a chip
            a.The key of the chip will be set to the tag
            b.The label of the chip will be set to the tag
            c.And for the onDelete, use the function handleRemoveAiTag for this specific tag */}
      <Dialog open={openAiDialog} onClose={() => setOpenAiDialog(false)}>
        <DialogTitle>AI Suggested Tags</DialogTitle>
        <DialogContent>
          <Typography variant="body2" mb={2}>
            Hey I found some tags that fit your entry! Do you want to add them?
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
            {aiTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                color="secondary"
                onDelete={() => handleRemoveAiTag(tag)}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenAiDialog(false);
              navigate("/");
            }}
            color="error"
          >
            No thanks!
          </Button>
          <Button
            onClick={handleAcceptAiTags}
            variant="contained"
            color="primary"
          >
            Yes, add them!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EntryPage;
