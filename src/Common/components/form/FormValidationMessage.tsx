import { Typography } from "@mui/material";

const FormValidationMessage = ({ isValid }: { isValid: boolean }) => {
  return (
    <>
      {!isValid && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          * Please fill all the required fields correctly.
        </Typography>
      )}
    </>
  );
};

export default FormValidationMessage;
