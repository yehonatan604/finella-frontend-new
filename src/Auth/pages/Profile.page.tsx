import { Box } from "@mui/material";
import Page from "../../Common/components/layout/Page";
import FormField from "../../Common/components/form/FormField";
import { FormProvider, useForm } from "react-hook-form";
import FormButtons from "../../Common/components/form/FormButtons";
import useAuth from "../hooks/useAuth";
import { DateTime } from "luxon";
import useTheme from "../../Common/hooks/useTheme";
import { TUser } from "../types/TUser";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { mode } = useTheme();
  const formMethods = useForm<TUser>({
    defaultValues: { ...user!, dob: user?.dob.split("T")[0] },
  });

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isValid },
  } = formMethods;

  console.log(watch());
  console.log(user);

  const onSubmit = async (data: TUser) => {
    await updateUser({
      name: data.name,
      dob: data.dob,
      email: data.email,
    } as TUser);
  };

  return (
    <Page title="Profile">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                margin: "0 auto",
                padding: "20px",
              }}
            >
              <FormField
                label="Email"
                name="email"
                type="text"
                required
                value={watch("email")}
                onChange={(e) => setValue("email", e.target.value)}
              />
              <FormField
                label="First Name"
                name="name.first"
                type="text"
                required
                value={watch("name.first")}
                onChange={(e) => setValue("name.first", e.target.value)}
              />
              <FormField
                label="Last Name"
                name="name.last"
                type="text"
                required
                value={watch("name.last")}
                onChange={(e) => setValue("name.last", e.target.value)}
              />
              <FormField
                className={mode === "dark" ? "dark" : ""}
                label="Date of Birth"
                type="date"
                name="dob"
                required
                value={watch("dob")}
                onChange={(e) => {
                  const date = DateTime.fromISO(e.target.value, {
                    zone: "local",
                  }).toISO();
                  setValue("dob", date?.split("T")[0] + "", {
                    shouldValidate: true,
                  });
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormButtons
                isValid={isValid}
                onReset={() => reset(user!)}
                actionButtonText="Update"
              />
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Page>
  );
};

export default ProfilePage;
