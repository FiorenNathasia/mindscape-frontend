import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid2,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  CardActionArea,
  LinearProgress,
} from "@mui/material";
import { format } from "date-fns";

function Homepage() {
  const [entryList, setEntryList] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEntryList = async () => {
    const token = localStorage.getItem("accessToken");
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/entry/`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    setEntryList(data.data);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/user/`,
      {
        headers: { Authorization: "Bearer " + token },
      }
    );
    setUser(data.data);
  };

  const fetchPageData = async () => {
    try {
      await fetchEntryList();
      await fetchUser();
    } catch (error) {
      console.log(123, error.status);
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const addEntry = () => {
    navigate("/addentry");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const previewText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(maxLength) + "...";
    }

    return text;
  };

  if (isLoading) return <LinearProgress width="100%" />;

  if (error) return <p>{error}</p>;

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
      <Box mb={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection="row"
          mb={3}
          width="100%"
          alignItems="flex-start"
        >
          <Typography variant="h4">Welcome back, {user.firstName}</Typography>

          <Button onClick={logout}>Logout</Button>
        </Box>

        <Button variant="contained" color="primary" onClick={addEntry}>
          New Entry
        </Button>
      </Box>

      <Grid2 container spacing={2}>
        {entryList.map((entry) => (
          <Grid2 key={entry.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <CardActionArea component={RouterLink} to={`/entry/${entry.id}`}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: 3,
                }}
              >
                <CardMedia component="img" image={entry.sketch} />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5">
                    {previewText(entry.title, 10)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {format(new Date(entry.updated_at), "d MMM")}
                  </Typography>
                  <Typography variant="body2">
                    {previewText(entry.text, 20)}
                  </Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
}

export default Homepage;
