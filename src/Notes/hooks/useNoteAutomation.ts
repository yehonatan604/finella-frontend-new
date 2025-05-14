import { useState, useCallback, useEffect } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { HTTPMethodTypes } from "../../Common/enums/HTTPMethodTypes";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";
import { entitiesActions } from "../../Core/store/entitiesSlice";
import { TNoteAutomation } from "../types/TNoteAutomation";
import { toastify } from "../../Common/utilities/toast";
import { DateTime } from "luxon";
import { convertedNoteAutomation } from "../helpers/convertAutomationDate";
import { question } from "../../Common/utilities/question";

const useNoteAutomation = () => {
    const { user } = useAuth();
    const { noteAutomations, notes } = useSelector(
        (state: TRootState) => state.entitiesSlice
    );
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);

    const addNoteAutomation = useCallback(() => {
        const now = DateTime.local().startOf("minute");
        const nowUTC = now.toUTC().toISO({ suppressMilliseconds: true }) || "";

        dispatch(entitiesActions.addEntityItem({
            type: "noteAutomations",
            item: {
                _id: `temp-${Date.now()}`,
                userId: user?._id || "",
                noteId: "",
                dateTime: nowUTC,
                repeat: "none",
                notes: "",
                lastTriggeredAt: null,
                status: "active",
            },
        }));
    }, [user?._id, dispatch]);


    const handleSaveChanges = useCallback(async () => {
        try {
            setLoading(true);
            const changedData = noteAutomations?.filter((automation) => {
                const converted = convertedNoteAutomation(automation);
                const originalAutomation = noteAutomations?.find((item) => item._id === converted._id);

                if (converted._id?.startsWith("temp")) {
                    return true;
                }

                return (
                    originalAutomation?.noteId !== converted.noteId ||
                    originalAutomation?.dateTime !== converted.dateTime ||
                    originalAutomation?.repeat !== converted.repeat ||
                    originalAutomation?.notes !== converted.notes ||
                    originalAutomation?.status !== converted.status
                );
            });

            changedData?.forEach(async (automation: TNoteAutomation) => {
                const converted = convertedNoteAutomation(automation);
                if (converted._id?.startsWith("temp")) {
                    delete converted._id;
                    const res = await sendApiRequest("/note-automations", HTTPMethodTypes.POST, {
                        ...converted,
                        userId: user?._id,
                    });

                    dispatch(entitiesActions.updateEntityItem({
                        type: "noteAutomations",
                        item: { ...converted, _id: res.data._id },
                        id: automation._id + "",
                    }));
                } else {
                    await sendApiRequest(`/note-automations`, HTTPMethodTypes.PUT, converted);
                    dispatch(entitiesActions.updateEntityItem({
                        type: "noteAutomations",
                        item: converted,
                        id: converted._id + "",
                    }));
                }
            });
            toastify.success("Changes saved successfully.");
        } catch (error) {
            console.error("Error saving changes:", error);
        } finally {
            setLoading(false);
        }
    }, [dispatch, noteAutomations, user?._id]);

    const onUndelete = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                await question(
                    "Undelete Note Automation",
                    "Are you sure you want to undelete this Note Automation?",
                    "warning",
                    async () => {
                        await sendApiRequest(`/note-automations/undelete/${id}`, HTTPMethodTypes.PATCH);
                        dispatch(entitiesActions.undeleteEntityItem({ type: "notes", id }));
                        toastify.success("Note Automation undeleted successfully");
                    }
                );
            } catch (e) {
                toastify.error("Error undeleting Note");
                console.error(e);
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    const onDelete = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                await question(
                    "Delete Note Automation",
                    "Are you sure you want to delete this Note Automation?",
                    "warning",
                    async () => {
                        await sendApiRequest(`/note-automations/${id}`, HTTPMethodTypes.DELETE);
                        dispatch(entitiesActions.removeEntityItem({ type: "noteAutomations", id }));
                        toastify.success("Note Automation deleted successfully");
                    }
                );
            } catch (e) {
                toastify.error("Error deleting Note");
                console.error(e);
            } finally {
                setLoading(false);
            }
        },
        [dispatch]
    );

    useEffect(() => {
        const fetchNoteAutomations = async () => {
            try {
                setLoading(true);
                const resAutomations = await sendApiRequest(
                    "/note-automations",
                    HTTPMethodTypes.GET
                );

                if (!notes) {
                    const resNotes = await sendApiRequest("/note/by", HTTPMethodTypes.GET);
                    dispatch(entitiesActions.setEntity({
                        type: "notes",
                        data: resNotes.data || [],
                    }));
                }

                dispatch(entitiesActions.setEntity({
                    type: "noteAutomations",
                    data: resAutomations.data || [],
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNoteAutomations();
    }, [notes, dispatch]);

    return {
        notes,
        noteAutomations,
        showAddNoteDialog,
        setShowAddNoteDialog,
        addNoteAutomation,
        handleSaveChanges,
        loading,
        onDelete,
        onUndelete,
    };
};

export default useNoteAutomation;