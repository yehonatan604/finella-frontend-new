import { Box } from "@mui/system";
import { blue } from "@mui/material/colors";
import LeftNavigation from "./LeftNavigation";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useEffect } from "react";
import useTheme from "../../hooks/useTheme";
import useAuth from "../../../Auth/hooks/useAuth";
import { TTheme } from "../../types/TTheme";
import { darkTheme } from "../../styles/themes/dark.theme";
import { lightTheme } from "../../styles/themes/light.theme";
import { CircularProgress } from "@mui/material";
import Footer from "./Footer";
import TopNavigation from "./TopNavigation";
import { useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { mode, setTheme } = useTheme();
  const { user, loading } = useAuth();
  const location = useLocation().pathname;

  const appliedTheme = createTheme(mode === "dark" ? darkTheme : lightTheme);

  useEffect(() => {
    const storageMode = localStorage.getItem("mode") || "light";
    localStorage.setItem("mode", storageMode);
    setTheme(storageMode as TTheme);
  }, [setTheme]);

  return (
    <ThemeProvider theme={appliedTheme}>
      {user ? <LeftNavigation /> : <TopNavigation hideHome={location === "/"} />}

      <Box
        component={"main"}
        sx={{
          "*": {
            transition: "all 0.5s ease, color 0.5s ease",
          },
          backgroundColor: mode === "light" ? blue[50] : "#0f172a",
          pt: user ? 4 : 0,
          pb: 2,
          px: 3,
          height: "100vh",
          overflow: "auto",
        }}
      >
        {children}
        {!user && <Footer />}
      </Box>
      {!user && loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            mt: 2,
          }}
        >
          <CircularProgress size={50} />
        </Box>
      )}
    </ThemeProvider>
  );
};

export default Layout;
