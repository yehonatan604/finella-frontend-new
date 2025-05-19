import { ReactNode } from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

const Page = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
  width?: string;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3 }}>
      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Page;
