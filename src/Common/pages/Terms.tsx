import { Container, Typography, Paper, Divider, Box } from "@mui/material";

const TermsPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Terms of Use & Privacy Policy
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" gutterBottom>
          1. Introduction
        </Typography>
        <Typography paragraph>
          Finella is a productivity and self-management app. By using this app, you agree
          to these terms and our data practices.
        </Typography>

        <Typography variant="h6" gutterBottom>
          2. User Data
        </Typography>
        <Typography paragraph>
          We only store the data you enter manually into the system, such as notes,
          salaries, and to-dos. Your data is never shared with third parties.
        </Typography>

        <Typography variant="h6" gutterBottom>
          3. Email Verification & Security
        </Typography>
        <Typography paragraph>
          You must confirm your email address to access your account. If you enter the
          wrong password three times, your account will be locked for 24 hours. You will
          receive an email with instructions to reset your password.
        </Typography>

        <Typography variant="h6" gutterBottom>
          4. Account Deletion
        </Typography>
        <Typography paragraph>
          You can request account deletion at any time. All associated data will be
          permanently removed.
        </Typography>

        <Typography variant="h6" gutterBottom>
          5. Cookies
        </Typography>
        <Typography paragraph>
          This app does not use cookies for tracking. Authentication is handled securely
          via tokens.
        </Typography>

        <Typography variant="h6" gutterBottom>
          6. Changes to These Terms
        </Typography>
        <Typography paragraph>
          We may update these terms from time to time. You will be notified in the app if
          changes are made.
        </Typography>

        <Box mt={4}>
          <Typography variant="body2" color="text.secondary">
            Last updated: May 2025
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsPage;
