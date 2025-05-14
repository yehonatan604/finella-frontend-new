import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type PdfDocProps = {
  rows: Record<string, unknown>[];
};

const NotesPdfDoc = (props: PdfDocProps) => {
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
    smallCell: {
      flex: 0.4,
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
          Workplaces Report
        </Text>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={{ ...styles.cell, flex: 0.6 }}>Name</Text>
            <Text style={styles.cell}>Content</Text>
            <Text style={styles.smallCell}>Date</Text>
            <Text style={styles.smallCell}>Status</Text>
            <Text style={styles.smallCell}>Is Sticky</Text>
          </View>

          {/* Data Rows */}
          {(rows as Record<string, string>[]).map((row, index) => (
            <View style={styles.row} key={index}>
              <Text style={{ ...styles.cell, flex: 0.6 }}>{row.name}</Text>
              <Text style={styles.cell}>{row.content}</Text>
              <Text style={styles.smallCell}>{row.date}</Text>
              <Text style={styles.smallCell}>{row.noteStatus}</Text>
              <Text style={styles.smallCell}>{row.isSticky ? "True" : "False"}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default NotesPdfDoc;
