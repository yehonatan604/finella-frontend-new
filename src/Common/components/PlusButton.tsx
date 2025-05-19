import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import useTheme from "../hooks/useTheme";

const PlusButton = ({
  addUrl = "",
  onClick,
}: {
  addUrl?: string;
  onClick?: () => void;
}) => {
  const { isLeftNavOpen } = useTheme();
  const nav = useNavigate();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={
        onClick
          ? onClick
          : () => {
              nav(addUrl);
            }
      }
      sx={{
        mt: 2,
        borderRadius: "100%",
        width: "80px",
        height: "80px",
        padding: 0.5,
        fontSize: "4rem",
        position: "fixed",
        right: isLeftNavOpen ? "3vw" : "12vw",
        bottom: "10vh",
        transition: "right 0.5s ease-in-out",
      }}
    >
      <AddIcon sx={{ fontSize: "inherit" }} />
    </Button>
  );
};

export default PlusButton;
