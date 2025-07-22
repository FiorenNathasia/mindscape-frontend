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
            py: 1,
          }}
        >
          <Box textAlign="center">
            <Box
              component="img"
              src={logoImage}
              alt="Mindscape Logo"
              sx={{
                height: { xs: 70, sm: 130 },
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
                    : theme.palette.primary.main,
                backgroundColor:
                  currentPath === "/"
                    ? theme.palette.primary.main
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    currentPath === "/"
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light,
                },
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

          {/* Mobile: show icon buttons only */}
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            {/* Assuming you want to keep FeedIcon, import it if used */}
            {/* <IconButton
              component={RouterLink}
              to="/feed"
              sx={{
                color:
                  currentPath === "/feed"
                    ? theme.palette.primary.dark
                    : theme.palette.primary.contrastText,
              }}
            >
              <FeedIcon />
            </IconButton> */}
            <IconButton
              component={RouterLink}
              to="/"
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <DashboardIcon />
            </IconButton>
            <IconButton
              onClick={handleLogout}
              sx={{
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                },
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
