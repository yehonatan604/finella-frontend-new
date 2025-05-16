# Finella Frontend

**A real-time self-management productivity app.** Track salaries, tasks, notes, and automate recurring responsibilities with ease.

---

## 📌 Table of Contents

- [Finella Frontend](#finella-frontend)
  - [📌 Table of Contents](#-table-of-contents)
  - [About Finella](#about-finella)
  - [Live Demo](#live-demo)
  - [Key Features](#key-features)
  - [Architecture Overview](#architecture-overview)
  - [Authentication \& Security](#authentication--security)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Running Locally](#running-locally)
  - [Project Structure](#project-structure)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)
  - [Author](#author)

---

## About Finella

Finella is a web-based front-end for a self-management productivity platform that helps users:

- **Track income** and visualize salary breakdowns
- **Manage notes** and pin important information
- **Organize to-dos**, set deadlines, and automate recurring alerts
- **Receive real-time notifications** via WebSockets
- **Export data** to PDF and Excel
- **Use built-in utilities** like a draggable timer and clocks

The interface is built for speed, responsiveness, and a polished user experience.

---

## Live Demo

Try it out in your browser:

[🔗 Finella App (on Render)](https://finella-frontend.onrender.com/)

---

## Key Features

- **Salary & Finance Tracking**: Interactive charts to analyze income history
- **Notes System**: Create, edit, pin, and filter notes with ease
- **To-Do Manager**: CRUD operations for tasks, with automation rules and alerts
- **Real-Time Notifications**: Socket.IO drives instant updates and alerts
- **Data Export**: Generate PDF reports (`@react-pdf/renderer`) and Excel files (`exceljs`)
- **Utility Tools**: Timer, world clock, and more in a floating toolbar
- **Theme Support**: Light and dark modes with MUI theming

---

## Architecture Overview

Finella follows a **modular, feature-based architecture**, where each primary domain (Auth, Notes, Todos, BalanceEntries, Tools, Workplaces) lives in its own folder with all related components, hooks, and styles. This promotes clear separation of concerns, scalability, and easier maintainability.

1. **Build & Bundling**: Vite powers fast development server and optimized production builds.
2. **UI Layer**: MUI (Material UI) components themed centrally for consistent look and feel.
3. **Feature Modules**: Each feature directory contains its own React components, Redux slices, TypeScript types, and styles, enabling isolated development and testing.
4. **State Management**: Redux Toolkit organizes global state with slice-level logic and actions for each feature.
5. **Real-Time Layer**: Socket.IO client connects to backend, authenticating via JWT during handshake and listening for automation events to dispatch Redux actions.
6. **Routing**: React Router handles navigation, with protected routes guarded by auth status and role.
7. **Date/Time Handling**: Luxon provides parsing, formatting, and timezone management throughout the app.
8. **Data Exports**:

   - **PDF Reports**: `@react-pdf/renderer` transforms React components into downloadable PDF documents.
   - **Excel Workbooks**: `exceljs` generates styled spreadsheets for financial data.

---

## Authentication & Security

Finella implements robust security measures:

- **JWT-Based Auth**: Stateless JSON Web Tokens authenticate REST and WebSocket connections.
- **Email Verification**: Users must confirm their email before accessing the app.
- **Account Lockout**: 3 invalid login attempts lock the account for 24 hours; an email reset link can unlock early.
- **Password Reset**: Secure, tokenized link delivered via email.
- **Protected Routes**: React Router guards client-side routes; backend middleware verifies JWTs on every request.

---

## Tech Stack

- **React** with **TypeScript**
- **Vite** (build tool)
- **MUI** (UI library)
- **Redux Toolkit** (state management)
- **React Router** (navigation)
- **Socket.IO Client** (real-time updates)
- **Luxon** (date/time)
- **@react-pdf/renderer** & **exceljs** (data export)

---

## Getting Started

### Prerequisites

- Node.js (>=14)
- npm or yarn
- Access to the [Finella backend](https://github.com/yehonatan604/Finella-backend)

### Installation

```bash
git clone https://github.com/yehonatan604/Finella-frontend.git
cd Finella-frontend
npm install
```

### Environment Variables

Create a `.env` file at project root and define:

```ini
VITE_API_URL=https://your-backend-url.com
# (optional) VITE_SOCKET_URL=wss://your-backend-url.com
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```bash
src/
├── Assets/          # Static images and icons
├── Auth/            # Login, Signup, Recovery pages
├── BalanceEntries/  # Salary entry forms and charts
├── Common/          # Shared components, hooks, utils
├── Core/            # AppEntry, Routes, Redux store setup
├── Notes/           # Note management and automations UI
├── Salaries/        # Models, calculations, and displays
├── Todos/           # To-do management and automation logic
├── Tools/           # Timer, clock, and other utilities
├── Workplaces/      # Workplace selection and management UI
├── App.tsx          # Main component with route definitions
├── main.tsx         # React DOM render and store/provider
└── vite-env.d.ts    # Vite-specific type declarations
```

---

## Deployment

- Frontend is hosted on **Render**: automatic builds on `main` branch.
- Compatible with any static hosting after `npm run build`.

---

## Contributing

Contributions, issues, and feature requests are welcome!

1. Fork it.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Author

Developed by [Yehonatan Moravia](https://github.com/yehonatan604).
Enjoy!
