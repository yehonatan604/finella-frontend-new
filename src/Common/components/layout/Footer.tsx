import { Box, Link, Typography } from "@mui/material";
import { Link as NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Finella &copy; {new Date().getFullYear()} | All rights reserved
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link component={NavLink} to="/terms">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: "bold" }}
              >
                Privacy Policy
              </Typography>
            </Link>
            <Link component={NavLink} to="/about">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: "bold" }}
              >
                About
              </Typography>
            </Link>
            <Link component={NavLink} to="/help">
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: "bold" }}
              >
                Help
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
