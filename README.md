# Finella – Frontend

Finella is a self-management productivity app designed to help individuals track their salaries, tasks, notes, and automate recurring responsibilities — all in a sleek, real-time interface powered by sockets and visual insights.

This repository contains the frontend of Finella, built with **React**, **MUI**, **Redux Toolkit**, **Socket.IO**, and **TypeScript**.

---

## 🌐 Live Demo: [Finella App (onRender)](https://finella-frontend.onrender.com/)

---

## Features

* **Salary & Finance Tracking** – Visualize income and salary breakdowns with charts.
* **Notes System** – Write, pin, and organize personal notes.
* **To-Do Manager** – Create, manage, and automate task alerts.
* **Real-Time Notifications** – Uses Socket.IO to alert on automations and deadlines.
* **Data Export** – Export your data to PDF or Excel files.
* **Utility Tools** – Includes a draggable Timer, real-time clocks, and more.
* **Dark Mode** – Aesthetic, comfortable, and themeable UI.

---

## Security & Authentication

Finella includes built-in protections to keep your account secure:

* **Email Verification Required**: After signing up, you must confirm your email address. You cannot log in until your account is verified.
* **Login Protection**: If you enter the wrong password 3 times in a row, your account will be locked for 24 hours. You will receive an email with a reset link to unlock it early.
* **Forgot Password**: If you forget your password, you can easily reset it via a secure email link.

---

## Tech Stack

* **React** + **Vite**
* **MUI** (Material UI)
* **Redux Toolkit** for state management
* **Socket.IO Client** for real-time communication
* **Luxon** for date/time manipulation
* **@react-pdf/renderer** & **ExcelJS** for exporting data
* **TypeScript** for type safety and better DX

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Finella-frontend.git
cd Finella-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env` file:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

> Make sure this matches your deployed backend or local server.

### 4. Run the development server

```bash
npm run dev
```

---

## Available Scripts

* `npm run dev` – Start development server
* `npm run build` – Build for production
* `npm run preview` – Preview the production build
* `npm run lint` – Run ESLint checks

---

## Project Structure

```
src/
├── Actions/        # Salary, Balance, ToDo logic
├── Common/         # Reusable UI & hooks
├── Notes/          # Note management logic
├── Records/        # Financial records & charts
├── ToDos/          # Task management
├── Tools/          # Draggable utilities like Timer
├── store/          # Redux setup
├── App.tsx         # Main app router
└── main.tsx        # Entry point
```

---

## Backend Repository: [Finella Backend GitHub](https://github.com/yehonatan604/Finella-backend)

---

## Deployment

* Frontend is hosted on **Render**.
* Compatible with static hosting (after `vite build`).
* You can also package it into a **PWA** or **Electron** app.

---

## Author

Made by [Yehonatan Moravia](https://github.com/yehonatan604)

---

## License

This project is open-source and available under the [MIT License](LICENSE).
