# MeetScribe

MeetScribe is a full-stack web application that turns meeting audio recordings into structured, actionable insights. Upload an audio file and get back a clean transcript, an executive summary, key decisions, and a trackable action item checklist — all generated automatically using Google Gemini AI.

---

## What it does

1. You upload an audio file of your meeting (MP3, WAV, M4A, OGG, WebM, or FLAC).
2. The backend sends the audio to Google Gemini, which transcribes it verbatim.
3. Gemini then analyzes the transcript and returns a structured JSON response containing a summary, key decisions, and action items with assignees.
4. Everything is saved to your account and displayed in a clean dark-mode UI.
5. You can tick off action items as they get done, and delete meetings you no longer need.

---

## Features

- **Audio upload** — drag-and-drop or click to upload meeting recordings in common audio formats
- **AI transcription** — full verbatim transcript generated directly from audio using Gemini 1.5 Flash
- **Smart summarization** — executive summary, numbered key decisions, and action items extracted in one pass
- **Action item tracker** — mark tasks as done or undone directly in the UI, with live remaining count
- **Real-time status polling** — the meeting detail page automatically refreshes while your audio is being processed, so you do not have to reload manually
- **JWT authentication** — register and log in with a secure token-based auth flow; all meeting data is private per user
- **Dark mode UI** — glassmorphism design with smooth fade-in animations and a responsive layout

---

## How it stands out

Most meeting tools require expensive subscriptions, send your audio to multiple third-party services, or give you only a raw transcript with no structure. MeetScribe handles everything in a single AI call — transcription and summarization happen together — which keeps latency low and gives you structured output immediately. The action item tracker is persistent, tied to your account, and updates without a page reload. The whole stack is open source and self-hostable with just a MongoDB instance and a free Gemini API key.

---

## Getting started

### Prerequisites

- Node.js 18 or higher
- MongoDB (local instance or MongoDB Atlas)
- Google Gemini API key — available free at [aistudio.google.com](https://aistudio.google.com/)

### 1. Clone and install root dependencies

```bash
git clone https://github.com/SourabhNikam-425/Meeting_Summarizer.git
cd Meeting_Summarizer
npm install
```

### 2. Install app dependencies

```bash
cd apps/backend && npm install
cd ../frontend && npm install
```

### 3. Configure the backend

Create a `.env` file inside `apps/backend/`:

```
MONGODB_URI=mongodb://localhost:27017/meeting_summarizer
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
PORT=3000
```

### 4. Run the backend

```bash
# from apps/backend
npm run dev
```

Server runs on `http://localhost:3000`

### 5. Run the frontend

```bash
# from apps/frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## API reference

| Method | Endpoint                                         | Auth | Description              |
|--------|--------------------------------------------------|------|--------------------------|
| POST   | `/api/auth/register`                             | No   | Register a new user      |
| POST   | `/api/auth/login`                                | No   | Login and get JWT token  |
| GET    | `/api/meetings`                                  | Yes  | List all your meetings   |
| POST   | `/api/meetings/upload`                           | Yes  | Upload and process audio |
| GET    | `/api/meetings/:id`                              | Yes  | Get meeting details      |
| DELETE | `/api/meetings/:id`                              | Yes  | Delete a meeting         |
| PATCH  | `/api/meetings/:id/action-items/:itemId/toggle`  | Yes  | Toggle an action item    |
| GET    | `/api/health`                                    | No   | Health check             |

---

## Project structure

```
Meeting_Summarizer/
├── apps/
│   ├── backend/
│   │   └── src/
│   │       ├── api/          # Routes and controllers
│   │       ├── db/           # Mongoose models
│   │       ├── services/     # Gemini AI and business logic
│   │       ├── middleware/   # Auth, error handling
│   │       ├── config/
│   │       └── utils/
│   └── frontend/
│       └── src/
│           ├── pages/        # Dashboard, Upload, Meeting detail, Login
│           ├── components/   # Layout and UI components
│           ├── hooks/        # Auth context, meeting polling
│           └── services/     # API client calls
└── package.json              # Workspace root
```

---

## Tech stack

- React, Vite, Tailwind CSS
- Node.js, Express
- MongoDB, Mongoose
- Google Gemini 1.5 Flash
- JWT, bcryptjs, Multer, Zod
