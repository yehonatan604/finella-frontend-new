import { TDbItem } from "../../Common/types/TDbItem";

export type TSalaryHours = TDbItem & {
    day: string;
    startTime: string;
    endTime: string;
    notes: string;
};