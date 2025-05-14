import { useState } from "react";
import Page from "../../Common/components/layout/Page";
import { Box, Button, Divider, MenuItem, Paper, Switch, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import useNoteAutomation from "../hooks/useNoteAutomation";
import { DateTime } from "luxon";
import useTheme from "../../Common/hooks/useTheme";
import FormDialog from "../../Common/components/dialogs/FormDialog";
import NoteForm from "../forms/Note.form";
import ShowInactiveCheckbox from "../../Common/components/ShowInactiveCheckbox";
import { useDispatch } from "react-redux";
import { entitiesActions } from "../../Core/store/entitiesSlice";

const NoteAutomationPage = () => {
  const {
    noteAutomations = [],
    notes,
    showAddNoteDialog,
    setShowAddNoteDialog,
    addNoteAutomation,
    handleSaveChanges,
    loading,
    onDelete,
    onUndelete,
  } = useNoteAutomation();
  const { mode } = useTheme();
  const dispatch = useDispatch();

  const [showInactive, setShowInactive] = useState(true);
  console.log(noteAutomations);

  return (
    <Page title="Note Automations">
      {noteAutomations && noteAutomations.length > 0 && (
        <>
          <ShowInactiveCheckbox
            showInactive={showInactive}
            setShowInactive={setShowInactive}
            label="Show Inactive Automations"
            sx={{ width: "53vw" }}
          />
          <Box
            component={Paper}
            display="flex"
            flexDirection="column"
            gap={2}
            p={2}
            sx={{
              maxHeight: "80vh",
              overflowY: "auto",
              width: "55vw",
            }}
          >
            {noteAutomations
              .filter((automation) => {
                if (showInactive) return true;
                return automation.status !== "inactive";
              })
              .map((automation, index) => (
                <div key={automation._id}>
                  <Box
                    display="flex"
                    flexDirection="row"
                    gap={2}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <TextField
                      select
                      value={automation.noteId}
                      size="small"
                      fullWidth
                      sx={{ minWidth: 200 }}
                      label={
                        noteAutomations[index].noteId &&
                        noteAutomations[index].noteId !== ""
                          ? "Note"
                          : "Select a Note"
                      }
                      onChange={(e) => {
                        dispatch(
                          entitiesActions.updateEntityItem({
                            type: "noteAutomations",
                            item: { ...automation, noteId: e.target.value },
                            id: automation._id + "",
                          })
                        );
                      }}
                    >
                      <MenuItem
                        value=""
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddNoteDialog(true);
                        }}
                      >
                        New Note
                      </MenuItem>
                      {notes!
                        .filter((note) => note.status !== "inactive")
                        .map((note) => (
                          <MenuItem key={note._id} value={note._id}>
                            {note.name}
                          </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                      size="small"
                      fullWidth
                      className={mode === "dark" ? "dark" : ""}
                      label="Date & Time"
                      type="datetime-local"
                      value={
                        automation.dateTime
                          ? DateTime.fromISO(automation.dateTime, {
                              zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                            }).toFormat("yyyy-MM-dd'T'HH:mm")
                          : ""
                      }
                      slotProps={{
                        inputLabel: {
                          shrink: true,
                        },
                      }}
                      sx={{ minWidth: 200 }}
                      onChange={(e) => {
                        const newLocal = DateTime.fromISO(e.target.value, {
                          zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                        });

                        const utcString =
                          newLocal.toUTC().toISO({ suppressMilliseconds: true }) || "";

                        dispatch(
                          entitiesActions.updateEntityItem({
                            type: "noteAutomations",
                            item: { ...automation, dateTime: utcString },
                            id: automation._id + "",
                          })
                        );
                      }}
                    />

                    <TextField
                      select
                      value={automation.repeat}
                      size="small"
                      fullWidth
                      sx={{ minWidth: 150 }}
                      label="Repeat"
                      onChange={(e) => {
                        dispatch(
                          entitiesActions.updateEntityItem({
                            type: "noteAutomations",
                            item: { ...automation, repeat: e.target.value },
                            id: automation._id + "",
                          })
                        );
                      }}
                    >
                      {["none", "daily", "weekly", "monthly"].map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label="Extra Notes"
                      size="small"
                      fullWidth
                      value={automation.notes || ""}
                      sx={{ minWidth: 300 }}
                      onChange={(e) => {
                        dispatch(
                          entitiesActions.updateEntityItem({
                            type: "noteAutomations",
                            item: { ...automation, notes: e.target.value },
                            id: automation._id + "",
                          })
                        );
                      }}
                      slotProps={{
                        inputLabel: {
                          shrink: automation.notes ? true : false,
                        },
                      }}
                    />

                    <Switch
                      checked={automation.status === "active"}
                      onChange={() => {
                        if (automation.status === "active") {
                          onDelete(automation._id || "");
                        } else {
                          onUndelete(automation._id || "");
                        }
                      }}
                      slotProps={{
                        input: {
                          "aria-label": "controlled",
                        },
                      }}
                      size="small"
                      sx={{
                        "& .MuiSwitch-thumb": {
                          backgroundColor:
                            automation.status === "active" ? "green" : "red",
                        },
                      }}
                    />
                  </Box>

                  <Divider sx={{ mt: 2 }} />
                </div>
              ))}
          </Box>
        </>
      )}

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            mt: 2,
          }}
        >
          <CircularProgress size={50} />
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            noteAutomations && noteAutomations.length > 0 ? "flex-start" : "center",
          gap: 2,
          p: 2,
          width: "1070px",
        }}
      >
        {(noteAutomations?.length ?? 0) > 0 && (
          <Button
            variant="contained"
            color="success"
            onClick={async () => {
              await handleSaveChanges();
            }}
          >
            Save Changes
          </Button>
        )}
        <Button variant="contained" color="primary" onClick={addNoteAutomation}>
          Add Automation
        </Button>
      </Box>

      {showAddNoteDialog && (
        <FormDialog
          open={showAddNoteDialog}
          onClose={() => setShowAddNoteDialog(false)}
          title="Add a Note"
          formComponent={<NoteForm setIsDialogOpen={setShowAddNoteDialog} />}
        />
      )}
    </Page>
  );
};

export default NoteAutomationPage;
