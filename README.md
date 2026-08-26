# VideoShare Frontend

React + Vite client for the private video sharing app. Upload videos, copy share links, browse a dashboard, and watch videos via `/v/:shareToken`.

## Features

- Drag-and-drop / click-to-upload
- Upload progress
- Copy shareable app URLs (not raw storage URLs)
- Videos dashboard with watch / copy / delete
- Public watch page with HTML5 video controls
- Loading, empty, and error states
- Responsive layout

## Tech Stack

- React + Vite
- React Router
- Tailwind CSS v4
- Axios
- Lucide React
- react-hot-toast

## Folder Structure

```
Fronted/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
└── README.md
```

## Installation

```bash
cd Fronted
npm install
cp .env.example .env
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (e.g. `http://localhost:5000/api`) |
| `VITE_MAX_VIDEO_SIZE_MB` | Optional client-side max size hint (default `500`) |

Never put R2 or backend secrets in frontend env files.

## Local Development

1. Start the backend (`Backend` folder) on port 5000.
2. Start the frontend:

```bash
npm run dev
```

App: `http://localhost:5173`

## Routes

| Path | Page |
|------|------|
| `/` | Upload |
| `/videos` | Dashboard |
| `/v/:shareToken` | Watch |
| `*` | 404 |

## Production Build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to any static host. Set `VITE_API_URL` to your production API URL at build time.
