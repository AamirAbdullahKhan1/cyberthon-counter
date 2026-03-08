# CYBERTHON'26 — Hackathon Countdown Timer

A real-time hackathon countdown website built for large digital boards with a dedicated coordinator admin panel.

## Features
- 🎬 **Cinematic transition** from inauguration screen to countdown
- 🖥️ **Large-screen optimized** UI using `clamp()` — looks great on digital boards
- 📡 **Real-time sync** across all screens via Socket.io (cross-device)
- 🔔 **Admin panel** at `/admin` — send notifications, set timers, initiate/reset the event
- 🔊 **Custom notification audio** with alert overlay on all displays

## Stack
- **Frontend**: React + Vite + Framer Motion
- **Backend**: Node.js + Express + Socket.io
- **Deploy**: Railway

## Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Start the backend
```bash
cd server
npm install
node server.js
```

### 3. Start the frontend (in another terminal)
```bash
npm run dev
```

- Main display: http://localhost:5173/
- Admin panel: http://localhost:5173/admin
- Backend: http://localhost:4000

## Deploy to Railway

### One-click deploy
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

### Manual steps
1. Push this repo to GitHub
2. Create a new project in [Railway](https://railway.app)
3. Connect the GitHub repo
4. Railway will auto-detect the `railway.json` — it will:
   - Run `npm run build` to compile the React frontend → `dist/`
   - Run `npm run start` to boot the Express server (serves both the API and `dist/`)
5. Copy the generated Railway URL and open `/admin` on the coordinator's device

### Environment Variables
See `.env.example` for available options. Railway sets `PORT` automatically.

## Project Structure
```
.
├── server/
│   └── server.js          # Express + Socket.io backend
├── src/
│   ├── components/
│   │   ├── InaugurationPage.jsx
│   │   ├── CountdownPage.jsx
│   │   ├── NotificationOverlay.jsx
│   │   └── AdminPanel.jsx
│   ├── styles/            # Per-component CSS
│   ├── assets/            # Videos, audio
│   ├── channel.js         # BroadcastChannel + audio helpers
│   └── socket.js          # Socket.io client
├── railway.json           # Railway deployment config
├── Procfile               # Fallback for Heroku-style deploys
└── .env.example           # Environment variable reference
```
