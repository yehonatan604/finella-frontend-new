import { TDbItem } from "../../Common/types/TDbItem";

export type TBalanceEntry = TDbItem & {
    userId: string;
    salaryId?: string;
    name: string;
    date: string;
    type: "income" | "expense";
    price: number;
    notes: string;
};  