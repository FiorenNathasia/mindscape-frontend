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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";
import Header from "../../components/Header/Header";

function AddEntry() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [aiTags, setAiTags] = useState([]);
  const [manualTags, setManualTags] = useState([]);
  const [manualTagInput, setManualTagInput] = useState("");
  const [openAiDialog, setOpenAiDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedEntryId, setSavedEntryId] = useState(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

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

  //Handles removing manualTags
  const handleRemoveManualTag = (tagToRemove) => {
    //Accesses the array of manualTags
    //It filters out the tags that is chosen (as tagToRemove) from the manualTags array
    setManualTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  //Handles removing aiTags
  const handleRemoveAiTag = (tagToRemove) => {
    //Accesses the array of aiTags
    //It filters out the tags that is chosen (as tagToRemove) from the aiTags array
    setAiTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async () => {
    const sketchDataURL = canvasRef.current.toDataURL("image/png");
    setIsSaving(true);
    const token = localStorage.getItem("accessToken");
    const entry = {
      title,
      sketch: sketchDataURL,
      text,
      // Add the manualTags array to the entry object for the backend
      tags: manualTags,
    };
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/entry/newentry`,
        entry,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      //Set the entry id to the state savedEntryId from the data response
      setSavedEntryId(data.data.id);
      //Set the suggested ai tags responds from the data response to the aiTags state
      setAiTags(data.aiTags);

      //If the length of the ai tags data response is greater than 0
      if (data.aiTags.length > 0) {
        //Open the dialog
        setOpenAiDialog(true);
      } else {
        //If there isn't, go to thr homepage
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
    setIsSaving(false);
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

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ paddingTop: 5 }}>
        <Box mb={3}>
          <Box
            display="flex"
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
          {/* Textfield for tags*/}
          <Box>
            <Typography variant="subtitle1">Manual Tags</Typography>
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
              4.And for the onDelete, use the function handleRemoveManualTag for this specific tag*/}
              {manualTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveManualTag(tag)}
                  color="primary"
                />
              ))}
            </Box>
          </Box>
        </Stack>
        <Button variant="contained" onClick={handleSubmit} disabled={isSaving}>
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
          {/*1.For this button, when it is clicked (onClick)
              a.Set the state of the openAiDialog to false
              b.And then immediately got to the homepage */}
          <Button
            onClick={() => {
              setOpenAiDialog(false);
              navigate("/");
            }}
            color="error"
          >
            No thanks!
          </Button>
          {/*1.For this button, when it is clicked (onClick)
              a.Execute the function handleAcceptAiTags to save 
              the suggested ai tags to the entry
              b.And then as stated in the function, it will go to the homepage */}
          <Button
            onClick={handleAcceptAiTags}
            variant="contained"
            color="primary"
          >
            Yes add them!
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddEntry;
