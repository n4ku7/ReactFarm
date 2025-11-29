# 🌾 AgriCraft React

AgriCraft is a **global marketplace for value-added farm goods**, connecting farmers with buyers worldwide.  
Built using **React 18**, **Vite 7**, and **Material UI (MUI)** with a **custom light pastel theme**, it provides a modern, fast, and responsive web experience for sustainable agriculture trade.

---

## 🚀 Tech Stack

- **Frontend:** React 18, Vite 7
- **UI Framework:** Material UI (MUI)
- **Styling:** Custom pastel theme, CSS3, MUI ThemeProvider
- **State Management:** React Hooks
- **Build Tool:** Vite
- **Language:** JavaScript (ES2023)

---

# 🌾 AgriCraft React

AgriCraft is a demo marketplace connecting farmers and buyers. This repository contains a Vite + React frontend and a small optional Express backend for local development.

Quick tech summary:
- React 18
```markdown
# 🌾 AgriCraft (React)

AgriCraft is a demo marketplace that connects farmers and buyers. This repository contains a Vite + React frontend and a small optional Express backend for local development and prototyping.

---

**Tech stack:** React 18, Vite, Material UI (MUI), Node/Express (optional backend)

---

**Quick start (frontend)**

- **Install dependencies:**

```powershell
npm install
```

- **Start dev server:**

```powershell
npm run dev
```

Open `http://localhost:5174` (or the port Vite displays) in your browser.

**Optional backend (for local API)**

The `server/` folder contains a small Express app that uses a JSON-based datastore (`lowdb`) for demo purposes.

- **Start backend (from project root):**

```powershell
npm --prefix server run start
```

- **Run backend in dev mode (with auto-restart):**

```powershell
npm --prefix server run dev
```

Default backend port: `4000` (check `server/package.json` and `server/index.js` for exact configuration).

---

**Project layout (key files)**

- `public/index.html` — HTML entry
- `src/main.jsx` — React entry, Router and context providers
- `src/App.jsx` — App layout and route definitions
- `src/components/common/` — `Navbar`, `Footer`, `ProductCard`, `ThemeProvider`
- `src/pages/` — Route pages grouped by dashboard/area
- `src/context/` — Authentication and cart context providers
- `vite.config.js` — Vite configuration
- `package.json` — frontend scripts and dependencies
- `server/` — optional Express backend and local routes

---

**Available scripts (frontend)**

- `npm run dev` — Start Vite dev server
- `npm run build` — Build production assets
- `npm run preview` — Preview built site locally

**Notes & next steps**

- This project is intended as a demo/prototype. The backend is not production-ready — add proper validation, authentication, and a real database before production use.
- If you want, I can:
	- add a short development checklist (`.env.example`),
	- add a contributing guide, or
	- set up GitHub Actions to run basic lint/tests.

---

© Project — local demo
```
