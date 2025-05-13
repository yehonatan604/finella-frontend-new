import { Box } from "@mui/material";
import Page from "../../../Common/components/layout/Page";
import FormField from "../../../Common/components/form/FormField";
import { FormProvider, useForm } from "react-hook-form";
import FormButtons from "../../../Common/components/form/FormButtons";
import useAuth from "../../hooks/useAuth";
import { joiResolver } from "@hookform/resolvers/joi";
import { changePasswordSchema } from "../../validations/changePassword.schema";
import { TChangePassword } from "../../types/TChangePassword";

const ChangePasswordPage = () => {
  const { changePassword } = useAuth();
  const formMethods = useForm<TChangePassword>({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: joiResolver(changePasswordSchema),
  });

  console.log(formMethods.formState.errors);

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isValid },
  } = formMethods;

  const onSubmit = async (data: TChangePassword) => {
    await changePassword({
      password: data.password,
      newPassword: data.newPassword,
    } as TChangePassword);
  };

  return (
    <Page title="Change Password">
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
                label="Password"
                name="password"
                type="password"
                required
                value={watch("password")}
                onChange={(e) =>
                  setValue("password", e.target.value, { shouldValidate: true })
                }
              />
              <FormField
                label="New Password"
                name="newPassword"
                type="password"
                required
                value={watch("newPassword")}
                onChange={(e) =>
                  setValue("newPassword", e.target.value, { shouldValidate: true })
                }
              />
              <FormField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                required
                value={watch("confirmPassword")}
                onChange={(e) =>
                  setValue("confirmPassword", e.target.value, { shouldValidate: true })
                }
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormButtons
                isValid={isValid}
                onReset={() => reset()}
                actionButtonText="Update"
              />
            </Box>
          </form>
        </FormProvider>
      </Box>
    </Page>
  );
};

export default ChangePasswordPage;
