import { createSlice } from "@reduxjs/toolkit";
import { RoleTypes } from "../../Auth/enums/RoleTypes";
import { TUser } from "../../Auth/types/TUser";

const initialState = {
    user: null as TUser | null,
    role: RoleTypes.GUEST,
}

const authSlice = createSlice({
    name: "auth",
    initialState: { ...initialState },
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
        },

        logout: (state) => {
            state.user = initialState.user;
            state.role = initialState.role;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export type TAuthState = typeof initialState;
export const authActions = authSlice.actions;
export default authSlice.reducer;
