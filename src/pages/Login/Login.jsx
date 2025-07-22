import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
import { CheckCircle } from "@mui/icons-material";
import Lottie from "lottie-react";
import backgroundImage from "../../assets/background/background.png";
import manAnimation from "../../assets/animations/manAnimation.json";
import logoImage from "../../assets/logo/mindscapeLogo.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );
      const accessToken = response.data.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDemoAccount = () => {
    setEmail("demo@email.com");
    setPassword("password");
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
            py: 3,
            maxWidth: 400,
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
                sx={{ maxWidth: 250, height: 230 }}
              />
            </Box>

            <Alert
              icon={<CheckCircle sx={{ color: "#C1440E" }} />}
              sx={{
                mb: 2,
                backgroundColor: "#FFDAB9",
                color: "#FFB677",
                fontWeight: 500,
                borderRadius: 1,
              }}
            >
              <Typography color="black">
                Just exploring?{" "}
                <Link
                  onClick={handleSetDemoAccount}
                  sx={{ cursor: "pointer", color: "#C1440E" }}
                >
                  Use a demo account
                </Link>
              </Typography>
            </Alert>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email Address"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              disabled={!email || !password || isLoading}
              sx={{ mt: 2, mb: 1, backgroundColor: "#E66A1D" }}
            >
              {isLoading ? (
                <>
                  Logging In...
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
                "Login"
              )}
            </Button>

            <Typography variant="body2" align="center">
              Don’t have an account?{" "}
              <Link component={RouterLink} to="/signup">
                Sign Up
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

export default Login;
