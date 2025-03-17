import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography, ButtonGroup } from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = {
      email,
      password,
    };
    try {
      const response = await axios.post(
        "http://localhost:3030/api/auth/login",
        user
      );
      const accessToken = response.data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      navigate("/");
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const signup = () => {
    navigate("/signup");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          padding: 3,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Welcome Back!
        </Typography>
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Button fullWidth>Login</Button>
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={signup}
            sx={{
              color: "#9ccc65", // Custom text color (label)
            }}
          >
            Signup
          </Button>
        </ButtonGroup>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            color="primary"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            color="primary"
          />
          <Box sx={{ marginTop: 2 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{
                marginBottom: 2,
                "&:hover": {
                  borderColor: "#9ccc65", // Custom border color on hover
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
