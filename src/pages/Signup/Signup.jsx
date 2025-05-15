import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Box, Typography, ButtonGroup } from "@mui/material";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = {
      firstName,
      lastName,
      email,
      password,
    };
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, user);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const login = () => {
    navigate("/login");
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
        <ButtonGroup
          variant="contained"
          aria-label="Basic button group"
          fullWidth
        >
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            sx={{
              color: "#9ccc65", // Custom text color (label)
            }}
            onClick={login}
          >
            Login
          </Button>
          <Button color="primary">Signup</Button>
        </ButtonGroup>
        <Box component="form" noValidate autoComplete="off">
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <TextField
              margin="normal"
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
              color="primary"
            />
            <TextField
              margin="normal"
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
              color="primary"
            />
          </Box>

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
export default Signup;
