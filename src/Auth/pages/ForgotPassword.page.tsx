import { Box } from "@mui/material";
import Page from "../../Common/components/layout/Page";
import FormField from "../../Common/components/form/FormField";
import { FormProvider, useForm } from "react-hook-form";
import FormButtons from "../../Common/components/form/FormButtons";
import useAuth from "../hooks/useAuth";
import { joiResolver } from "@hookform/resolvers/joi";
import { forgotPasswordSchema } from "../validations/forgotPassword.schema";

const ForgotPasswordPage = () => {
  const { forgotPassword } = useAuth();
  const formMethods = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
    resolver: joiResolver(forgotPasswordSchema),
  });

  console.log(formMethods.formState.errors);

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isValid },
  } = formMethods;

  const onSubmit = async (data: { email: string }) => {
    await forgotPassword(data);
  };

  return (
    <Page title="Forgot Password">
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
                type="email"
                required
                value={watch("email")}
                onChange={(e) =>
                  setValue("email", e.target.value, { shouldValidate: true })
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

export default ForgotPasswordPage;
