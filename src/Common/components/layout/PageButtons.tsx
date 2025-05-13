import { FC } from "react";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AddchartIcon from "@mui/icons-material/Addchart";
import { exportDataToExcel } from "../../helpers/exportDataToExcel";
import { exportDataToPDF } from "../../helpers/exportDataToPDF";

type PageButtonsProps = {
  fileName: string;
  rows: Record<string, unknown>[];
  Doc: FC<{ rows: Record<string, unknown>[] }>;
  openCharts?: () => void;
};

const PageButtons = (props: PageButtonsProps) => {
  const { fileName, rows, Doc, openCharts } = props;
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, ml: 2 }}
        startIcon={<FileDownloadIcon />}
        onClick={() => {
          exportDataToExcel([...rows], `${fileName}`);
        }}
      >
        Export to Excel
      </Button>

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 2, ml: 2 }}
        startIcon={<PictureAsPdfIcon />}
        onClick={async () => {
          const data = [...rows];
          data.pop();
          exportDataToPDF(<Doc rows={data} />, `${fileName}`);
        }}
      >
        Export to PDF
      </Button>

      {openCharts && (
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2, ml: 2, color: "white" }}
          startIcon={<AddchartIcon />}
          onClick={openCharts}
        >
          Create Charts
        </Button>
      )}
    </Box>
  );
};

export default PageButtons;
