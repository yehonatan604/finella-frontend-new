import { Box } from "@mui/material";
import { LuAnnoyed } from "react-icons/lu";
import SubMain from "../components/layout/SubMain";

const ErrorPage = () => {
  return (
    <SubMain>
      <Box
        sx={{
          mb: 10,
          color: "text.primary",
          py: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <LuAnnoyed size={100} />
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>404 - Page Not Found</h1>
          <p style={{ fontSize: "1.5rem" }}>
            Oops! The page you are looking for does not exist.
          </p>
        </Box>
      </Box>
    </SubMain>
  );
};

export default ErrorPage;
