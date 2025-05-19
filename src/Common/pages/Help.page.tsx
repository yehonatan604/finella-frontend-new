import { Container, Typography, Paper, Divider, Link } from "@mui/material";

const HelpPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          🆘 Finella Help & Support
        </Typography>

        <Typography variant="body1" gutterBottom>
          Welcome to Finella! This guide will walk you through the main features and how
          to use them effectively.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Authentication */}
        <Typography variant="h5" gutterBottom>
          🔐 Authentication
        </Typography>
        <Typography variant="body1" gutterBottom>
          - You must verify your email address before logging in.
          <br />
          - After 3 failed login attempts, your account will be locked for 24 hours. You
          will receive an email to reset your password.
          <br />- Forgot your password? Use the <strong>Forgot Password</strong> link to
          receive a reset link via email.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Notes */}
        <Typography variant="h5" gutterBottom>
          📝 Notes
        </Typography>
        <Typography variant="body1" gutterBottom>
          - Create, edit, pin, and delete notes.
          <br />
          - Use the sticky option to highlight important notes.
          <br />- Real-time alerts will notify you when automations trigger a note.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* ToDos */}
        <Typography variant="h5" gutterBottom>
          ✅ ToDos
        </Typography>
        <Typography variant="body1" gutterBottom>
          - Organize your tasks with start/end dates.
          <br />
          - Tasks marked as completed will remain in history.
          <br />- When an unfinished task passes the due date, it becomes a note and
          triggers a socket alert.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Salaries / Balance Entries */}
        <Typography variant="h5" gutterBottom>
          💼 Salaries & Income Tracking
        </Typography>
        <Typography variant="body1" gutterBottom>
          - Add detailed salary records for each workplace.
          <br />
          - Visualize salary breakdowns with charts.
          <br />
          - Export salary data to Excel or PDF.
          <br />
          <em>Add screenshot of salary chart and export buttons here 📸</em>
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Tools */}
        <Typography variant="h5" gutterBottom>
          🛠 Tools
        </Typography>
        <Typography variant="body1" gutterBottom>
          - Use draggable widgets like Timer and Clock.
          <br />
          - The Timer runs even when minimized.
          <br />- New tools can be added in future versions.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Export */}
        <Typography variant="h5" gutterBottom>
          📁 Exporting Data
        </Typography>
        <Typography variant="body1" gutterBottom>
          - Click <strong>Export to Excel</strong> or <strong>Export to PDF</strong> for
          the selected data view.
          <br />
          - Excel files have bold headers and automatic column width.
          <br />
          - PDFs are auto-downloaded after generation.
          <br />
          <em>Add image of export actions and resulting files here 📸</em>
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Real-time */}
        <Typography variant="h5" gutterBottom>
          🔔 Real-Time Alerts
        </Typography>
        <Typography variant="body1" gutterBottom>
          - The app uses Socket.IO to deliver alerts for Notes and ToDos.
          <br />
          - Alerts pop up instantly and are marked read when opened.
          <br />- You must be online and logged in to receive real-time updates.
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Contact */}
        <Typography variant="h5" gutterBottom>
          📬 Still Need Help?
        </Typography>
        <Typography variant="body1" gutterBottom>
          You can open an issue on the{" "}
          <Link
            href="https://github.com/yehonatan604/Finella-frontend"
            target="_blank"
            rel="noopener"
          >
            GitHub repository
          </Link>{" "}
          or contact the developer directly.
        </Typography>
      </Paper>
    </Container>
  );
};

export default HelpPage;
