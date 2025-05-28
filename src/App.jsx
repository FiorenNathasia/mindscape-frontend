import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Homepage from "./pages/Homepage/Homepage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AddEntry from "./pages/AddEntry/AddEntry";
import EntryPage from "./pages/EntryPage/EntryPage";

const theme = createTheme({
  palette: {
    background: {
      default: "#fffaf4",
    },
    primary: {
      main: "#f57224",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#5d4037",
    },
    text: {
      primary: "#3e2c1c",
      secondary: "#5d4037",
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            bgcolor: "background.default",
            color: "text.primary",
            minHeight: "100vh",
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/entry/:id" element={<EntryPage />} />
                <Route path="/addentry" element={<AddEntry />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;
