import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { HTTPMethodTypes } from "../../Common/enums/HTTPMethodTypes";
import { authActions } from "../../Core/store/authSlice";
import { TRootState } from "../../Core/store/store";
import { sendApiRequest } from "../../Common/helpers/sendApiRequest";
import { toastify } from "../../Common/utilities/toast";
import { alert } from "../../Common/utilities/alert";
import { AxiosError } from "axios";
import useSocket from "../../Common/hooks/useSocket";
import { TUser } from "../types/TUser";
import { TChangePassword } from "../types/TChangePassword";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { user, role } = useSelector((state: TRootState) => state.authSlice);
    const { POST, GET, PUT, PATCH } = HTTPMethodTypes;
    const dispatch = useDispatch();
    const nav = useNavigate();
    useSocket(user!);

    const signup = useCallback(async (data: Record<string, unknown>) => {
        setLoading(true);
        try {
            const response = await sendApiRequest("/auth/register", POST, data);
            await alert(
                "Sign Up",
                "Account created successfully, please check your email to verify your account.",
                "success",
            )
            return response;
        } catch (error) {
            const err = error as AxiosError;
            await alert(
                "Signup Failed",
                err?.response?.data + "",
                "error",
            );
        } finally {
            setLoading(false);
        }
    }, [POST]);

    const logout = useCallback(() => {
        nav("/");
        dispatch(authActions.logout());
        localStorage.removeItem("token");
    }, [dispatch, nav]);

    const login = useCallback(async (data: Record<string, unknown>) => {
        setLoading(true);
        try {
            const response = await sendApiRequest("/auth/login", POST, data);
            if (response) {
                localStorage.setItem("token", response.data.token);
                dispatch(authActions.login({ role: response.data.role.permission, user: response.data.user }));
                toastify.success("Login successful!");
            }
        } catch (err) {
            const error = err as AxiosError;
            console.log(error);
            await alert(
                "Login Failed",
                error?.response?.data + (error.response?.data === "Too many login attempts" ? ", Please check your email." : ""),
                "error",
            );
        } finally {
            setLoading(false);
        }
    }, [POST, dispatch]);

    const loginByToken = useCallback(async (token: string) => {
        setLoading(true);
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            const response = await sendApiRequest("/auth/" + decoded._id, GET);
            if (response) {
                dispatch(authActions.login({ role: response.data.role.permission, user: response.data.user }));
                toastify.success(`Welcome back ${response.data.user.name.first} ${response.data.user.name.last}`);
            }
        } catch (err) {
            const error = err as Error;
            console.log(error);
            toastify.error("Token expired, please login.");
            logout();
        } finally {
            setLoading(false);
        }
    }, [GET, dispatch, logout]);

    const updateUser = useCallback(async (user: TUser) => {
        setLoading(true);
        try {
            const response = await sendApiRequest("/auth", PUT, user);
            if (response) {
                dispatch(authActions.setUser(user));
                toastify.success("User updated successfully!");
            }
        } catch (err) {
            const error = err as AxiosError;
            console.log(error);
            alert(
                "Update Failed",
                error?.response?.data + "",
                "error",
            );
        } finally {
            setLoading(false);
        }
    }, [PUT, dispatch]);

    const changePassword = useCallback(async (data: TChangePassword) => {
        setLoading(true);
        try {
            const response = await sendApiRequest("/auth/change-password", PATCH, data);
            if (response) {
                toastify.success("Password changed successfully!");
            }
        } catch (err) {
            const error = err as AxiosError;
            console.log(error);
            alert(
                "Change Password Failed",
                error?.response?.data + "",
                "error",
            );
        } finally {
            setLoading(false);
        }
    }, [PATCH]);

    const forgotPassword = useCallback(async (data: { email: string }) => {
        setLoading(true);
        try {
            const response = await sendApiRequest("/auth/forgot-password/" + data.email, GET);
            if (response) {
                toastify.success("Password reset link sent to your email!");
            }
        } catch (err) {
            const error = err as AxiosError;
            console.log(error);
            alert(
                "Forgot Password Failed",
                error?.response?.data + "",
                "error",
            );
        } finally {
            setLoading(false);
        }
    }, [GET]);

    return {
        user,
        role,
        loading,
        signup,
        login,
        logout,
        loginByToken,
        updateUser,
        changePassword,
        forgotPassword,
    };
};

export default useAuth;