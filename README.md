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
- Vite
- Material UI (MUI)

## Project layout (important files)
- `public/index.html` — HTML entry
- `src/main.jsx` — app entry and Router
- `src/App.jsx` — routes and layout
- `src/components/common/` — Navbar, Footer, ThemeProvider
- `src/pages/` — app pages
- `vite.config.js` — dev server config
- `package.json` — scripts
- `server/` — optional Express backend (added)

## Run (frontend)
1. Install dependencies

```cmd
npm install
```

2. Start dev server

```cmd
npm run dev
```

Open http://localhost:5174 (or the port Vite shows) in your browser.

## Optional backend

The `server/` folder contains a small Express app using `lowdb` as a JSON datastore. It is meant for local development and prototyping only.

Start backend (from project root):

```cmd
npm --prefix server run start
```

Or run dev auto-restart:

```cmd
npm --prefix server run dev
```

Backend endpoints (default port 4000):
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/users`
- `POST /api/users`
- `GET /api/orders`
- `POST /api/orders`

Security note: this backend is not production-ready. Add validation, auth, and proper database before using in production.

## Next steps I can do for you
- Add authentication (JWT + password hashing)
- Replace `lowdb` with SQLite or Postgres and add migrations
- Seed the DB with realistic demo data
- Wire frontend pages to the backend endpoints

Tell me which of these you'd like next.
