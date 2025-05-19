import { Box, Paper } from "@mui/material";
import useSalary from "../hooks/useSalary";
import { GridColDef } from "@mui/x-data-grid";
import Page from "../../Common/components/layout/Page";
import SalariesPdfDoc from "../components/SalariesPdfDoc";
import PageFilters from "../../Common/components/layout/PageFilters";
import PageButtons from "../../Common/components/layout/PageButtons";
import PlusButton from "../../Common/components/PlusButton";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";
import { useState } from "react";
import StyledDataGrid from "../../Common/components/styled/StyledDataGrid";
import useTheme from "../../Common/hooks/useTheme";
import { TDataGridRow } from "../../Common/types/TDataGridRow";
import { pageSizeOptions } from "../../Common/helpers/paginationHelpers";
import FormDialog from "../../Common/components/dialogs/FormDialog";
import WorkplaceForm from "../../Workplaces/forms/WorkplaceForm";
import SalaryForm from "../forms/SalaryForm";
import SalariesChartsDialog from "../components/SalariesChartsDialog";

const SalariesPage = () => {
  const {
    workplaces,
    columns,
    rows,
    setFromYear,
    setToYear,
    setMonths,
    setPickedWorkplaces,
    selectedSalary,
    setSearch,
    filteredRows,
    showInactive,
    setShowInactive,
    loading,
    paginatedRows,
    paginationModel,
    setPaginationModel,
    isUploadDialogOpen,
    setIsUploadDialogOpen,
  } = useSalary(true);

  const [isChartsDialogOpen, setIsChartsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddWorkplaceDialogOpen, setIsAddWorkplaceDialogOpen] = useState(false);
  const { mode } = useTheme();

  return (
    <>
      <Page title="Salaries">
        <PageFilters
          setSearch={setSearch}
          setFromYear={setFromYear}
          setToYear={setToYear}
          setMonths={setMonths}
          setPickedWorkplaces={setPickedWorkplaces}
          workplaces={workplaces!}
        />
        <ShowInactiveCheckbox
          showInactive={showInactive}
          setShowInactive={setShowInactive}
          label="Show Inactive Salaries"
        />
        <Box
          component={Paper}
          sx={{
            display: "flex",
            flexDirection: "column",
            "& .super-app-theme--header": {
              backgroundColor: mode === "light" ? "primary.main" : "ffffff",
              color: "#fff",
              fontWeight: "bold",
            },
          }}
        >
          <StyledDataGrid
            rows={paginatedRows as TDataGridRow[]}
            rowCount={
              !showInactive
                ? filteredRows.filter(
                    (row) => "status" in row && row.status !== "inactive"
                  ).length
                : filteredRows.length
            }
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            columns={columns as GridColDef[]}
            getRowClassName={(params) =>
              params.id === "total"
                ? "total"
                : params.indexRelativeToCurrentPage % 2 === 0
                ? "even"
                : "odd"
            }
            loading={loading}
            pageSizeOptions={pageSizeOptions}
            disableRowSelectionOnClick
            onCellEditStart={(_, event) => {
              event.defaultMuiPrevented = true;
            }}
            isRowSelectable={() => false}
          />
        </Box>
      </Page>

      {paginatedRows.length > 0 && (
        <PageButtons
          fileName="Salaries"
          rows={rows}
          Doc={SalariesPdfDoc}
          openCharts={() => setIsChartsDialogOpen(true)}
        />
      )}
      <PlusButton onClick={() => setIsAddDialogOpen(true)} />

      {isChartsDialogOpen && (
        <SalariesChartsDialog
          open={isChartsDialogOpen}
          onClose={() => setIsChartsDialogOpen(false)}
          data={filteredRows.filter((d) => d.id !== "total")}
        />
      )}

      <FormDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        title="Add a Salary"
        formComponent={
          <SalaryForm
            setIsDialogOpen={setIsAddDialogOpen}
            setIsAddWorkplaceDialogOpen={setIsAddWorkplaceDialogOpen}
          />
        }
      />

      <FormDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        title="Update Salary"
        formComponent={
          <SalaryForm
            setIsDialogOpen={setIsUploadDialogOpen}
            setIsAddWorkplaceDialogOpen={setIsAddWorkplaceDialogOpen}
            salary={selectedSalary}
          />
        }
      />

      <FormDialog
        open={isAddWorkplaceDialogOpen}
        onClose={() => setIsAddWorkplaceDialogOpen(false)}
        title="Add a Workplace"
        formComponent={<WorkplaceForm setIsDialogOpen={setIsAddWorkplaceDialogOpen} />}
      />
    </>
  );
};

export default SalariesPage;
