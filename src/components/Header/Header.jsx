import { useTheme } from "@mui/material/styles";
import {
  Container,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import logoImage from "../../assets/logo/colored-logo.png";

function Header() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <Box sx={{ backgroundColor: theme.palette.primary.light }}>
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box textAlign="center">
            <Box
              component="img"
              src={logoImage}
              alt="Mindscape Logo"
              sx={{
                height: { xs: 110, sm: 130 },
                marginTop: "1rem",
              }}
            />
          </Box>

          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <Button
              component={RouterLink}
              to="/"
              startIcon={<DashboardIcon />}
              variant={currentPath === "/" ? "contained" : "text"}
              sx={{
                color:
                  currentPath === "/"
                    ? theme.palette.primary.contrastText
                    : "#ffffff",
                backgroundColor:
                  currentPath === "/"
                    ? theme.palette.primary.main
                    : "transparent",
              }}
            >
              Dashboard
            </Button>

            <Button
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ color: theme.palette.primary.contrastText }}
            >
              Logout
            </Button>
          </Stack>

          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton
              component={RouterLink}
              to="/"
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              }}
            >
              <DashboardIcon />
            </IconButton>
            <IconButton
              onClick={handleLogout}
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Header;
