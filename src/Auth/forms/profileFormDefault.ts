import { TUser } from "../types/TUser"

export const profileFormDefault = (user: TUser) => ({
    email: user.email,
    name: user.name,
    dob: user.dob,
});