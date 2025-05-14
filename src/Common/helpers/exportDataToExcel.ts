import * as XLSX from "xlsx";

export const exportDataToExcel = (
    data: Record<string, unknown>[],
    fileName: string = "salaries"
) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const keys = Object.keys(data[0] || {});

    keys.forEach((_, colIdx) => {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIdx });
        if (!ws[cellAddress]) return;

        ws[cellAddress].s = {
            font: { bold: true },
            alignment: { horizontal: "center", vertical: "center" },
            fill: {
                patternType: "solid",
                fgColor: { rgb: "DCE6F1" }, // Light blue
            },
            border: {
                top: { style: "thin", color: { auto: 1 } },
                bottom: { style: "thin", color: { auto: 1 } },
            },
        };
    });

    ws["!cols"] = keys.map((key) => ({
        wch: Math.max(key.length + 2, 12),
    }));

    const maybeTotalRow = data.findIndex(
        (row) =>
            row.id === "total" ||
            row.name === "Total" ||
            row.workplace === "Total"
    );

    if (maybeTotalRow !== -1) {
        keys.forEach((_, colIdx) => {
            const cellAddress = XLSX.utils.encode_cell({
                r: maybeTotalRow + 1, // +1 because header row is row 0
                c: colIdx,
            });
            if (!ws[cellAddress]) return;

            ws[cellAddress].s = {
                font: { bold: true },
                fill: {
                    patternType: "solid",
                    fgColor: { rgb: "E8F5E9" }, // Light green
                },
            };
        });
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, `${fileName}.xlsx`, { cellStyles: true });
};
