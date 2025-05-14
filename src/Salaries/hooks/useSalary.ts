import { useState, useCallback, useEffect, useMemo } from "react";
import useAuth from "../../Auth/hooks/useAuth";
import { HTTPMethodTypes } from "../../Common/enums/HTTPMethodTypes";
import { TSalary } from "../types/TSalary";
import { TSalaryHours } from "../types/TSalaryHours";
import useWorkplaces from "../../Workplaces/hooks/useWorkplace";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { toastify } from "../../Common/utilities/toast";
import { salaryCols } from "../data/salaryCols";
import { TDataGridInputCellParams } from "../../Common/types/TDataGridInputCellParams";
import { salaryRows } from "../data/salaryRows";
import { question } from "../../Common/utilities/question";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../Core/store/store";
import { entitiesActions } from "../../Core/store/entitiesSlice";
import { defaultPageSize, paginatedRows } from "../../Common/helpers/paginationHelpers";
import useBalanceEntry from "../../BalanceEntries/hooks/useBalanceEntry";
import { calcTotalHours, calcTotalSum, getFullDate } from "../helpers/salaryHelpers";

const useSalary = (isPage?: boolean) => {
    const { user } = useAuth();
    const { workplaces, getAllWorkplaces } = useWorkplaces();
    const {
        bEntries, getBalanceEntries, onUpdate: onUpdateBentry, onDelete: onDeleteBentry, onUndelete: onUndeleteBentry
    } = useBalanceEntry();

    const fetchedSalaries = useSelector((state: TRootState) => state.entitiesSlice.salaries);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [salaryHours, setSalaryHours] = useState<TSalaryHours[]>([]);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [fromYear, setFromYear] = useState(new Date().getFullYear());
    const [toYear, setToYear] = useState(new Date().getFullYear());
    const [months, setMonths] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [selectedSalary, setSelectedSalary] = useState<TSalary | null>(null);
    const [search, setSearch] = useState<string>("");
    const [showInactive, setShowInactive] = useState(false);
    const [addBEntry, setAddBEntry] = useState(true);
    const [pickedWorkplaces, setPickedWorkplaces] = useState<string[]>(
        workplaces
            ?.map((workplace) => workplace._id)
            .filter((id): id is string => id !== undefined) || []
    );
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: defaultPageSize,
    });

    const onSubmit = async (data: TSalary) => {
        try {
            setLoading(true);
            const newSalary = await sendApiRequest("/salary", HTTPMethodTypes.POST, data);
            dispatch(entitiesActions.addEntityItem({ type: "salaries", item: newSalary.data }));
            if (addBEntry) {
                const workplace = workplaces?.find(
                    (workplace) => workplace._id === data.workPlaceId
                );

                const balanceEntry = {
                    userId: user?._id,
                    salaryId: newSalary.data._id,
                    name: `Salary ${data.date} - ${workplace?.name}`,
                    price: calcTotalSum(data as TSalary, workplaces || []) || workplace?.pricePerMonth,
                    date: getFullDate(data).toISOString(),
                    type: "income",
                    notes: `Salary ${data.date} - ${workplace?.name}`,
                };
                const newBentry = await sendApiRequest("/balance-entry", HTTPMethodTypes.POST, balanceEntry);
                dispatch(entitiesActions.addEntityItem({ type: "balanceEntries", item: newBentry.data }));
                toastify.success("Balance Entry added successfully");
            }
            toastify.success("Salary added successfully");
        } catch (error) {
            console.log(error);
            toastify.error("Error adding Salary");
        } finally {
            setLoading(false);
            setSelectedSalary(null);
            setSalaryHours([]);
        }
    };

    const toggleUploadDialog = useCallback(() => {
        setIsUploadDialogOpen((prev) => !prev);
    }, []);

    const getSalaries = useCallback(async (query: string) => {
        try {
            setLoading(true);
            const response = await sendApiRequest("/salary/by" + query, HTTPMethodTypes.GET);
            dispatch(entitiesActions.setEntity({ type: "salaries", data: response.data }));
        }
        catch (error) {
            console.log(error);
            toastify.error("Error fetching salaries");
        } finally {
            setLoading(false);
        }
    }, [dispatch]);


    const onUpdate = useCallback(
        async (data: TSalary) => {
            try {
                setLoading(true);

                data.hours.forEach((hour) => {
                    delete hour._id;
                });

                await sendApiRequest(`/salary`, HTTPMethodTypes.PUT, data);


                await getBalanceEntries("?salaryId=" + data._id);
                const balanceEntry = bEntries?.find((entry) => entry.salaryId === data._id);
                if (balanceEntry) {
                    const updatedEntry = {
                        ...balanceEntry,
                        price: +calcTotalSum(data, workplaces || []) || +(workplaces?.find(
                            (workplace) => workplace._id === data.workPlaceId
                        )?.pricePerMonth || 0),
                        date: getFullDate(data).toISOString(),
                        name: `Salary ${getFullDate(data).toLocaleDateString("he-IL", { year: "numeric" })} - ${workplaces?.find(
                            (workplace) => workplace._id === data.workPlaceId
                        )?.name}`,
                        notes: `Salary ${getFullDate(data).toLocaleDateString("he-IL", { year: "numeric" })} - ${workplaces?.find(
                            (workplace) => workplace._id === data.workPlaceId
                        )?.name}`,
                    };

                    await onUpdateBentry(updatedEntry);
                }

                dispatch(entitiesActions.updateEntityItem({ type: "salaries", item: data, id: data._id! }));
                toastify.success("Balance Entry updated successfully");
            } catch (error) {
                console.log(error);
                toastify.error("Error updating Balance Entry");
            } finally {
                setLoading(false);
                setSelectedSalary(null);
                setSalaryHours([]);
            }
        },
        [bEntries, dispatch, getBalanceEntries, onUpdateBentry, workplaces]
    );

    const onCellUpdate = useMemo(
        () =>
            (
                row: TSalary & {
                    id: string | undefined;
                    workplace: string | undefined;
                    year: number | undefined;
                    month: number | undefined;
                    "total hours": number | undefined;
                    "total sum": number | undefined;
                }
            ) => {
                const fetchedRow = fetchedSalaries?.find((bEntry) => bEntry._id === row.id);

                const changedFetchedRow = {
                    workplace: fetchedRow?.workPlaceId || "",
                    year: fetchedRow?.date.split("-")[1] || 0,
                    month: fetchedRow?.date.split("-")[0] || 0,
                    "total hours": calcTotalHours(fetchedRow?.hours || []),
                    "total sum": calcTotalSum(fetchedRow!, workplaces || []) || 0,
                };

                const changedRow = {
                    workplace: workplaces?.find((workplace) => workplace.name === row.workplace)?._id || "",
                    year: row.year || 0,
                    month: row.month || 0,
                    "total hours": row["total hours"] || 0,
                    "total sum": row["total sum"] || 0,
                };

                const fields: Array<keyof typeof changedFetchedRow> = ["workplace", "year", "month", "total hours", "total sum"];
                const isEqual = fields.every((field) => changedFetchedRow[field] === changedRow[field]);

                if (isEqual) return;

                const finalRow = {
                    _id: row.id,
                    userId: user?._id,
                    workPlaceId: changedRow.workplace,
                    date: `${changedRow.month}-${changedRow.year}`,
                    hours: fetchedRow?.hours || [],
                    notes: fetchedRow?.notes || "",
                };

                onUpdate(finalRow as unknown as TSalary);
            },
        [fetchedSalaries, onUpdate, user?._id, workplaces]
    );

    const onDelete = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                await question(
                    "Delete Salary",
                    "Are you sure you want to delete this Salary?",
                    "warning",
                    async () => {
                        await sendApiRequest(`/salary/${id}`, HTTPMethodTypes.DELETE, { userId: user?._id });
                        dispatch(entitiesActions.removeEntityItem({ type: "salaries", id }));
                        toastify.success("Salary deleted successfully");

                        await getBalanceEntries("?salaryId=" + id);

                        const balanceEntry = bEntries?.find((entry) => entry.salaryId === id);
                        if (balanceEntry) {
                            await onDeleteBentry(balanceEntry._id!);
                        }
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error deleting Salary");
            } finally {
                setLoading(false);
                setSelectedSalary(null);
                setSalaryHours([]);
            }
        }, [user?._id, dispatch, getBalanceEntries, bEntries, onDeleteBentry]);

    const onUndelete = useCallback(
        async (id: string) => {
            try {
                setLoading(true);
                await question(
                    "Undelete Salary",
                    "Are you sure you want to undelete this Salary?",
                    "warning",
                    async () => {
                        await sendApiRequest(`/salary/undelete/${id}`, HTTPMethodTypes.PATCH, { userId: user?._id });
                        dispatch(entitiesActions.undeleteEntityItem({ type: "salaries", id }));
                        toastify.success("Salary undeleted successfully");

                        await getBalanceEntries("?salaryId=" + id);

                        const balanceEntry = bEntries?.find((entry) => entry.salaryId === id);
                        if (balanceEntry) {
                            await onUndeleteBentry(balanceEntry._id!);
                        }
                    }
                );
            } catch (error) {
                console.log(error);
                toastify.error("Error undeleting Salary");
            } finally {
                setLoading(false);
                setSelectedSalary(null);
                setSalaryHours([]);
            }
        },
        [user?._id, dispatch, getBalanceEntries, bEntries, onUndeleteBentry]
    );

    const columns = useMemo(
        () => salaryCols(
            workplaces!,
            onCellUpdate,
            (params: TDataGridInputCellParams) => {
                setSelectedSalary(
                    fetchedSalaries?.find((salary) => salary._id === params.row.id) || null
                );
                setIsUploadDialogOpen(true);
            },
            (params: TDataGridInputCellParams) => onDelete(params.row.id as string),
            (params: TDataGridInputCellParams) => onUndelete(params.row.id as string),
        ), [fetchedSalaries, onCellUpdate, workplaces, onDelete, onUndelete]
    );

    const rows = useMemo(() => salaryRows(
        fetchedSalaries ?? [],
        workplaces!,
        calcTotalHours,
        (salary: TSalary) => calcTotalSum(salary, workplaces!)
    ), [fetchedSalaries, workplaces]);

    const filteredRows = rows.filter((row) =>
        JSON.stringify(row).toLowerCase().includes(search.toLowerCase()) &&
        (showInactive || (row as { status: string }).status !== "inactive")
    );

    useEffect(() => {
        if (!workplaces) getAllWorkplaces();

        if (isPage) {
            const fetchData = async () => {
                const queryParams = new URLSearchParams();

                if (pickedWorkplaces.length > 0) {
                    queryParams.append("workplaceIds", pickedWorkplaces.join(","));
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
                await getSalaries(`?${queryString}`);
            };

            fetchData();
        }
    }, [fromYear, getAllWorkplaces, getSalaries, isPage, months, pickedWorkplaces, toYear, workplaces]);

    return {
        onSubmit,
        toggleUploadDialog,
        isUploadDialogOpen,
        setIsUploadDialogOpen,
        salaryHours,
        workplaces,
        columns,
        rows,
        setFromYear,
        setToYear,
        setMonths,
        setPickedWorkplaces,
        loading,
        fetchedSalaries,
        onUpdate,
        selectedSalary,
        setSearch,
        filteredRows,
        showInactive,
        setShowInactive,
        paginationModel,
        setPaginationModel,
        paginatedRows: paginatedRows(paginationModel, filteredRows),
        setAddBEntry,
        addBEntry,
        user,
        setSalaryHours,
    };
};

export default useSalary;