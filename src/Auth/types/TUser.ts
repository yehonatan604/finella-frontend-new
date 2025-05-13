import { TDbItem } from "../../Common/types/TDbItem";

export type TUser = TDbItem & {
    email: string;
    name: {
        first: string;
        last: string;
    }
    password: string;
    dob: string;
    workPlaces: string[];
} 