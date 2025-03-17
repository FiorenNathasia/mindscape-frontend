import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Homepage from "./pages/Homepage/Homepage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AddEntry from "./pages/AddEntry/AddEntry";
import EntryPage from "./pages/EntryPage/EntryPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#9575cd",
    },
    secondary: {
      main: "#9ccc65",
    },
    background: {
      default: "#303f9f",
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entry/:id"
              element={
                <ProtectedRoute>
                  <EntryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addentry"
              element={
                <ProtectedRoute>
                  <AddEntry />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
