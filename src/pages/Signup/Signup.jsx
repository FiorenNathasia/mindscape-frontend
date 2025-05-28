import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Alert,
  Link,
  Stack,
  LinearProgress,
} from "@mui/material";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const user = {
      firstName,
      lastName,
      email,
      password,
    };
    try {
      setIsLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, user);
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LinearProgress width="100%" />}
      <Container maxWidth="xs">
        <Box
          sx={{
            pt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" mb={5}>
            Sign Up
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: "100%",
                mt: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Stack direction="column" gap={2} width="100%" mt={2} mb={2}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              helperText={!!error && !firstName ? "First name is required" : ""}
            />

            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              helperText={!!error && !lastName ? "Last name is required" : ""}
            />

            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText={!!error && !email ? "Email is required" : ""}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={
                isLoading || !email || !password || !firstName || !lastName
              }
            >
              Sign Up
            </Button>
          </Stack>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Log in
            </Link>
          </Typography>
        </Box>
      </Container>
    </>
  );
}
export default Signup;
