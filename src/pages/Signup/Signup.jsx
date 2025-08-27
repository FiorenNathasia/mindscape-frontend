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
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import Lottie from "lottie-react";
import backgroundImage from "../../assets/background/background.png";
import manAnimation from "../../assets/animations/manAnimation.json";
import logoImage from "../../assets/logo/mindscapeLogo.png";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = { firstName, lastName, email, password };
    try {
      setIsLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, user);
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <Container
        sx={{
          maxWidth: { xs: "none", sm: "100%" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card
          sx={{
            px: 4,
            py: 1,
            maxWidth: 400,
            maxHeight: 650,
            width: "100%",
            boxShadow: 5,
            backdropFilter: "blur(10px)",
          }}
        >
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box
                component="img"
                src={logoImage}
                alt="Mindscape Logo"
                sx={{ maxWidth: 250, height: 200 }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={
                isLoading || !email || !password || !firstName || !lastName
              }
              sx={{ mt: 2, mb: 1, backgroundColor: "#E66A1D" }}
            >
              {isLoading ? (
                <>
                  Signing Up...
                  <CircularProgress
                    size={20}
                    sx={{
                      color: "#FFB677",
                      position: "absolute",
                      right: 16,
                    }}
                  />
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <Typography variant="body2" align="center">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login">
                Log in
              </Link>
            </Typography>
          </CardContent>
        </Card>
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            alignItems: "center",
            pl: 20,
          }}
        >
          <Lottie animationData={manAnimation} style={{ width: 600 }} loop />
        </Box>
      </Container>
    </Box>
  );
}

export default Signup;
