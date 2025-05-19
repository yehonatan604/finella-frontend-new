import { Box, IconButton } from "@mui/material";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import useTheme from "../../hooks/useTheme";

export const TopNavigation = ({ hideHome = false }: { hideHome?: boolean }) => {
  const { mode, setTheme } = useTheme();
  const nav = useNavigate();

  return (
    <Box
      sx={{
        position: "absolute",
        top: 20,
        left: 20,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
      }}
    >
      <IconButton onClick={() => setTheme(mode === "dark" ? "light" : "dark")}>
        {mode === "dark" ? (
          <LightModeRoundedIcon sx={{ color: "white" }} />
        ) : (
          <DarkModeRoundedIcon sx={{ color: "text.standard" }} />
        )}
      </IconButton>

      {!hideHome && (
        <IconButton sx={{ color: mode === "dark" ? "white" : "text.standard" }}>
          <HomeIcon onClick={() => nav("/")} />
        </IconButton>
      )}
    </Box>
  );
};

export default TopNavigation;
