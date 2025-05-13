import { HTTPMethodTypes } from "../../Common/enums/HTTPMethodTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { toastify } from "../../Common/utilities/toast";
import { parseToUTCISO, formatDateLuxon } from "../../Common/helpers/dateTimeHelpers";
import { todoCols } from "../data/todoCols";
import { todoRows } from "../data/todoRows";
import { question } from "../../Common/utilities/question";
import { TRootState } from "../../Core/store/store";
import { useDispatch, useSelector } from "react-redux";
import { entitiesActions } from "../../Core/store/entitiesSlice";
import { defaultPageSize, paginatedRows } from "../../Common/helpers/paginationHelpers";
import { TToDo } from "../types/TToDo";
import { TDataGridInputCellParams } from "../../Common/types/TDataGridInputCellParams";

const useToDo = (isTodoPage: boolean = false, all: boolean = false) => {
  const { user } = useAuth();
  const fetchedToDos = useSelector((state: TRootState) => state.entitiesSlice.todos);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [fromYear, setFromYear] = useState(new Date().getFullYear());
  const [toYear, setToYear] = useState(new Date().getFullYear());
  const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const [pickedStatus, setPickedStatus] = useState<string>("all");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedToDo, setSelectedToDo] = useState<TToDo | null>(null);
  const [search, setSearch] = useState<string>("");
  const [showInactive, setShowInactive] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: defaultPageSize,
  });

  const getToDos = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        const response = await sendApiRequest("/todo/by" + query, HTTPMethodTypes.GET);
        dispatch(entitiesActions.setEntity({ type: "todos", data: response.data }));
      } catch (error) {
        console.log(error);
        toastify.error("Error fetching ToDos");
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  const onUpdate = useCallback(
    async (data: TToDo) => {
      try {
        setLoading(true);
        await sendApiRequest(`/todo`, HTTPMethodTypes.PUT, {
          ...data,
          userId: user?._id,
        });
        dispatch(
          entitiesActions.updateEntityItem({ type: "todos", item: data, id: data._id! })
        );
        toastify.success("ToDo updated successfully");
      } catch (error) {
        console.log(error);
        toastify.error("Error updating ToDo");
      } finally {
        setLoading(false);
      }
    },
    [user?._id, dispatch]
  );

  const onCellUpdate = useMemo(
    () =>
      (
        row: TToDo & {
          id: string | undefined;
        }
      ) => {
        const fetchedRow = fetchedToDos?.find((toDo) => toDo._id === row.id);

        const fields = [
          "name",
          "description",
          "startDate",
          "endDate",
          "toDoStatus",
        ] as const;

        const normalizeRow = (row: Partial<TToDo>) => ({
          name: row?.name,
          description: row?.description,
          startDate: formatDateLuxon(row?.startDate),
          endDate: formatDateLuxon(row?.endDate),
          toDoStatus: row?.toDoStatus,
        });

        const checkFetchedRow = normalizeRow(fetchedRow as TToDo);
        const checkRow = normalizeRow(row);

        const isEqual = fields.every(
          (field) => checkFetchedRow[field] === checkRow[field]
        );

        if (isEqual) return;

        const finalRow = {
          _id: row.id,
          userId: fetchedRow?.userId,
          tasks: fetchedRow?.tasks,
          name: row.name ?? fetchedRow?.name ?? "",
          description: row?.description ?? fetchedRow?.description ?? "",
          startDate: parseToUTCISO(row.startDate),
          endDate: parseToUTCISO(row.endDate),
          toDoStatus: row.toDoStatus ?? fetchedRow?.toDoStatus ?? "PENDING",
          notes: row.notes ?? fetchedRow?.notes ?? "",
        };

        onUpdate(finalRow as unknown as TToDo);
      },
    [fetchedToDos, onUpdate]
  );

  const onUndelete = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await question(
          "Undelete Todo",
          "Are you sure you want to undelete this Todo?",
          "warning",
          async () => {
            await sendApiRequest(`/todo/undelete/${id}`, HTTPMethodTypes.PATCH, {
              userId: user?._id,
            });
            dispatch(entitiesActions.undeleteEntityItem({ type: "todos", id }));
            toastify.success("ToDo undeleted successfully");
          }
        );
      } catch (error) {
        console.log(error);
        toastify.error("Error undeleting ToDo");
      } finally {
        setLoading(false);
      }
    },
    [user?._id, dispatch]
  );

  const onDelete = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await question(
          "Delete ToDo",
          "Are you sure you want to delete this ToDo?",
          "warning",
          async () => {
            await sendApiRequest(`/todo/${id}`, HTTPMethodTypes.DELETE, {
              userId: user?._id,
            });
            dispatch(entitiesActions.removeEntityItem({ type: "todos", id }));
            toastify.success("ToDo deleted successfully");
          }
        );
      } catch (error) {
        console.log(error);
        toastify.error("Error deleting ToDo");
      } finally {
        setLoading(false);
      }
    },
    [user?._id, dispatch]
  );

  const onSubmit = useCallback(
    async (data: TToDo) => {
      try {
        setLoading(true);
        if (data.tasks?.[0]?.name === "") {
          delete data.tasks;
        }

        const payload = {
          ...data,
          userId: user?._id,
          startDate: parseToUTCISO(data.startDate),
          endDate: parseToUTCISO(data.endDate),
        };

        await sendApiRequest(`/todo`, HTTPMethodTypes.POST, payload);
      } catch (error) {
        console.log(error);
        toastify.error("Error adding ToDo");
      } finally {
        setLoading(false);
      }
    },
    [user?._id]
  );

  const columns = useMemo(
    () =>
      todoCols(
        onCellUpdate,
        (params: TDataGridInputCellParams) => {
          setSelectedToDo(fetchedToDos?.find((todo) => todo._id === params.id) ?? null);
          setIsUpdateDialogOpen(true);
        },
        (params: TDataGridInputCellParams) => {
          onDelete(params.id as string);
        },
        (params: TDataGridInputCellParams) => onUndelete(params.row.id as string)
      ),
    [onCellUpdate, fetchedToDos, onDelete, onUndelete]
  );

  const rows = useMemo(() => todoRows(fetchedToDos ?? []), [fetchedToDos]);

  const filteredRows = rows.filter(
    (row) =>
      JSON.stringify(row).toLowerCase().includes(search.toLowerCase()) &&
      (showInactive || (row as { status: string }).status !== "inactive")
  );

  useEffect(() => {
    if (!isTodoPage) return;
    const fetchData = async () => {
      const queryParams = new URLSearchParams();

      if (pickedStatus) {
        queryParams.append("toDoStatus", pickedStatus === "all" ? "" : pickedStatus);
      }

      if (fromYear) {
        queryParams.append("fromYear", fromYear.toString());
      }

      if (toYear) {
        queryParams.append("toYear", toYear.toString());
      }

      if (months.length > 0 && months.length < 12) {
        queryParams.append("months", months.join(","));
      }

      const queryString = queryParams.toString();
      await getToDos(!all ? `?${queryString}` : "");
    };

    fetchData();
  }, [fromYear, toYear, months, pickedStatus, isTodoPage, getToDos, all]);

  return {
    onSubmit,
    onUpdate,
    loading,
    columns,
    rows,
    fromYear,
    setFromYear,
    toYear,
    setToYear,
    months,
    setMonths,
    pickedStatus,
    setPickedStatus,
    fetchedToDos,
    processRowOnCellUpdate: onCellUpdate,
    selectedToDo,
    setSelectedToDo,
    setSearch,
    filteredRows,
    showInactive,
    setShowInactive,
    paginationModel,
    setPaginationModel,
    paginatedRows: paginatedRows(paginationModel, filteredRows),
    onDelete,
    onUndelete,
    user,
    isUpdateDialogOpen,
    setIsUpdateDialogOpen,
  };
};

export default useToDo;
