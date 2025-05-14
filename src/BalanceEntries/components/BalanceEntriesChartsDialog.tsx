import { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  DialogContentText,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import DialogXButton from "../../Common/components/dialogs/DialogXButton";
import html2canvas from "html2canvas";
import {
  PDFDownloadLink,
  Document,
  Page,
  Image as PDFImage,
  StyleSheet,
} from "@react-pdf/renderer";
import { formatStringDate } from "../../Common/helpers/dateTimeHelpers";

type BalanceEntriesChartsDialogProps = {
  open: boolean;
  onClose: () => void;
  incomingData: (
    | {
        id: string | undefined;
        name: string;
        date: string;
        type: "income" | "expense";
        price: string | number;
        notes: string;
        status: string | undefined;
      }
    | {
        id: string;
        name: string;
        price: string;
      }
  )[];
};

function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split("/");
  return new Date(`${year}-${month}-${day}`);
}

const styles = StyleSheet.create({
  image: {
    width: 500,
    height: 600,
    objectFit: "contain",
    margin: "20 auto",
  },
});

const BalanceEntriesChartsDialog = ({
  open,
  onClose,
  incomingData,
}: BalanceEntriesChartsDialogProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [pdfReady, setPdfReady] = useState(false);

  const data =
    incomingData?.sort(
      (a, b) =>
        new Date(formatStringDate("" + (a as { date: string }).date))?.getTime() -
        new Date(formatStringDate("" + (b as { date: string }).date))?.getTime()
    ) || [];

  const handleExportToPdf = async () => {
    if (!chartRef.current) return;

    chartRef.current.classList.toggle("light-mode-export");
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });
    chartRef.current.classList.toggle("light-mode-export");

    const dataUrl = canvas.toDataURL("image/png");
    setChartImage(dataUrl);
    setPdfReady(true);
  };

  const MyPDFDocument = () => (
    <Document>
      <Page size="A4">
        {chartImage && <PDFImage src={chartImage} style={styles.image} />}
      </Page>
    </Document>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      sx={{
        left: "50%",
        transform: "translate(-50%)",
        display: "flex",
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          color: "#fff",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: "1rem",
        }}
      >
        Balance Entries Report
        <DialogXButton onClose={onClose} />
      </DialogTitle>

      <DialogContent>
        <div ref={chartRef} style={{ padding: 16 }}>
          <DialogContentText sx={{ mb: 1 }}>By Name</DialogContentText>
          <BarChart
            xAxis={[
              {
                id: "categories",
                data: data.filter((d) => d.id !== "total").map((d) => d.name),
                scaleType: "band",
              },
            ]}
            yAxis={[{ id: "price-axis", min: -10000, max: 10000 }]}
            series={[
              {
                data: data
                  .filter((d) => d.id !== "total")
                  .map((d) =>
                    typeof d.price === "string" ? parseFloat(d.price) : d.price
                  ),
              },
            ]}
            width={900}
            height={450}
          />

          <Divider sx={{ my: 2 }} />

          <DialogContentText sx={{ mb: 1 }}>By Date</DialogContentText>
          <LineChart
            xAxis={[
              {
                id: "dates",
                data: data
                  .filter((d) => d.id !== "total" && "date" in d)
                  .map((d) => parseDDMMYYYY((d as { date: string }).date)),
                scaleType: "time",
              },
            ]}
            yAxis={[{ id: "price-axis", min: -10000, max: 10000 }]}
            series={[
              {
                id: "prices",
                label: "Amount",
                data: data
                  .filter((d) => d.id !== "total" && "price" in d)
                  .map((d) =>
                    typeof d.price === "string" ? parseFloat(d.price) : d.price
                  ),
              },
            ]}
            width={900}
            height={450}
          />
        </div>
      </DialogContent>

      <DialogActions>
        {!pdfReady || !chartImage ? (
          <Button onClick={handleExportToPdf} color="primary" variant="contained">
            Prepare PDF
          </Button>
        ) : (
          <PDFDownloadLink
            document={<MyPDFDocument />}
            fileName="charts-report.pdf"
            style={{ textDecoration: "none" }}
          >
            {({ loading }) => (
              <Button variant="contained" disabled={loading}>
                {loading ? "Generating..." : "Download PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        )}

        <Button onClick={onClose} color="error" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BalanceEntriesChartsDialog;
