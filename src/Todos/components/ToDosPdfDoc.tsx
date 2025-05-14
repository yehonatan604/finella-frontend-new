import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type PdfDocProps = {
  rows: Record<string, unknown>[];
};

const ToDosPdfDoc = (props: PdfDocProps) => {
  const { rows } = props;

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      padding: 20,
      fontSize: 12,
    },
    table: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      padding: 5,
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: "#1976D2",
      color: "#FFF",
      fontWeight: "bold",
      padding: 5,
    },
    cell: {
      flex: 1,
      textAlign: "center",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 10,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Salary Report
        </Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.cell}>Name</Text>
            <Text style={styles.cell}>Description</Text>
            <Text style={styles.cell}>Start Date</Text>
            <Text style={styles.cell}>End Date</Text>
            <Text style={styles.cell}>Status</Text>
            <Text style={styles.cell}>Tasks</Text>
          </View>

          {/* Data Rows */}
          {rows.map((row, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{row.name + ""}</Text>
              <Text style={styles.cell}>{row.description + ""}</Text>
              <Text style={styles.cell}>{row.startDate + ""}</Text>
              <Text style={styles.cell}>{row.endDate + ""}</Text>
              <Text style={styles.cell}>{row.toDoStatus + ""}</Text>
              <Text style={styles.cell}>{row.tasks + ""}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default ToDosPdfDoc;
