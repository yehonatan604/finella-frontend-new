import { ReactNode } from "react";
import { Box } from "@mui/system";
import { useSelector } from "react-redux";
import useAuth from "../../../Auth/hooks/useAuth";
import { TRootState } from "../../../Core/store/store";

const SubMain = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const isLeftNavOpen = useSelector(
    (state: TRootState) => state.themeSlice.isLeftNavOpen
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginLeft: user ? (isLeftNavOpen ? "15vw" : "0vw") : "0vw",
        transition: "margin-left 0.5s",
      }}
    >
      {children}
    </Box>
  );
};

export default SubMain;
