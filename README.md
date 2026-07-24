# TaskFlow — Task Management API Platform

A full-stack task management application built for **DecodeLabs Industrial Training Kit — Project 2 (Backend API Development)**.

The project's core is a fully functional, validated, and documented REST API built with **Node.js, Express, and TypeScript**. The React dashboard is a real client of that API — every stat, list, create, edit, and delete action is a live network call, nothing is hardcoded or mocked.

---

## 1. Project Overview

TaskFlow lets a user create, view, update, and delete tasks through a RESTful backend, and manage them from a responsive dashboard: track counts by status/priority, search and filter the task list, and edit tasks through modal forms — all backed by real API calls with proper HTTP status codes and error handling.

## 2. Features

- Dashboard with live stats: total, pending, in-progress, completed, high-priority counts
- Recent tasks feed and a quick "Add Task" action
- Full task CRUD: create, read (list + single), update, delete
- Search by title, filter by status/priority, sort by date/title/priority
- Task details, edit, and delete confirmation modals
- Toast notifications, loading skeletons, empty states, and error states
- Centralized backend error handling with consistent JSON response shape
- Zod-based request validation with field-level error messages
- Persistent JSON-file storage (survives server restarts) with seed data

## 3. Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router
**Backend:** Node.js, Express, TypeScript
**Storage:** Persistent JSON file storage (`backend/data/db.json`) — chosen as a
zero-native-dependency alternative to SQLite/Prisma, per the project's fallback
guidance, so the app runs anywhere Node runs with no compiled bindings or
generated client step.
**Validation:** Zod
**Tooling:** dotenv, CORS, ESLint

## 4. Folder Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/        # env loading
│   │   ├── controllers/   # request/response handling
│   │   ├── routes/        # Express route definitions
│   │   ├── services/      # business logic (filtering, sorting, stats)
│   │   ├── models/        # Task type + enums
│   │   ├── middleware/    # 404 handler + centralized error handler
│   │   ├── validators/    # Zod schemas
│   │   ├── utils/         # ApiError, ApiResponse, JSON db helper
│   │   ├── app.ts         # Express app assembly
│   │   └── server.ts      # entry point
│   ├── data/db.json       # persistent storage + seed data
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # fetch client + tasks API module
│   │   ├── components/    # Sidebar, Header, badges, modals, table, etc.
│   │   ├── pages/         # Dashboard, Tasks
│   │   ├── context/       # Toast notifications
│   │   ├── hooks/         # useTasks
│   │   └── types/         # shared Task types
│   ├── .env.example
│   └── package.json
└── README.md
```

## 5. Installation

Requires **Node.js 18+**.

```bash
# Clone / unzip, then from the project root:
cd backend && npm install
cd ../frontend && npm install
```

## 6. Environment Variable Setup

**backend/.env** (copy from `backend/.env.example`):

```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_FILE=./data/db.json
```

**frontend/.env** (copy from `frontend/.env.example`):

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 7. Database Setup

No separate setup step is needed — `backend/data/db.json` ships with 8 seed
tasks so the app is demonstrable immediately after install. The file is
created automatically (with an empty task list) if it's ever missing.

## 8. Running the Backend

```bash
cd backend
npm run dev      # development mode (auto-reload via nodemon)
# or
npm run build && npm start   # production build
```

The API runs at `http://localhost:5000`. Health check: `GET /api/health`.

## 9. Running the Frontend

```bash
cd frontend
npm run dev
```

The dashboard runs at `http://localhost:5173` and expects the backend at
the URL set in `VITE_API_BASE_URL`.

## 10. API Documentation

Base URL: `/api`

### Health check
`GET /api/health` → 200, `{ status: "ok", timestamp }`

### Get all tasks
`GET /api/tasks`

Query parameters (all optional):
| Param | Values | Description |
|---|---|---|
| `status` | `pending` \| `in-progress` \| `completed` | filter by status |
| `priority` | `low` \| `medium` \| `high` | filter by priority |
| `search` | string | case-insensitive title search |
| `sortBy` | `createdAt` \| `updatedAt` \| `title` \| `priority` \| `status` | sort field (default `createdAt`) |
| `order` | `asc` \| `desc` | sort direction (default `desc`) |

Example: `GET /api/tasks?status=pending&sortBy=priority&order=desc`

Success `200`:
```json
{ "success": true, "data": [ /* Task[] */ ], "message": "Tasks fetched successfully" }
```
Errors: `400` invalid query param, `500` server error.

### Get dashboard stats
`GET /api/tasks/stats` → `200`
```json
{
  "success": true,
  "data": { "total": 8, "pending": 3, "inProgress": 2, "completed": 3, "highPriority": 3 },
  "message": "Stats fetched successfully"
}
```

### Get a single task
`GET /api/tasks/:id`
- `200` if found, `404` if not:
```json
{ "success": false, "message": "Task not found", "errors": [] }
```

### Create a task
`POST /api/tasks`

Request body:
```json
{
  "title": "Learn REST APIs",
  "description": "Build and test backend API endpoints",
  "status": "pending",
  "priority": "high"
}
```
`status`/`priority` are optional and default to `pending` / `medium`.

Validation rules: `title` and `description` are required and cannot be
empty; `status` must be `pending`/`in-progress`/`completed`; `priority`
must be `low`/`medium`/`high`.

Success `201`:
```json
{
  "success": true,
  "data": {
    "id": 9,
    "title": "Learn REST APIs",
    "description": "Build and test backend API endpoints",
    "status": "pending",
    "priority": "high",
    "createdAt": "2026-07-24T10:00:00.000Z",
    "updatedAt": "2026-07-24T10:00:00.000Z"
  },
  "message": "Task created successfully"
}
```
Error `400`:
```json
{ "success": false, "message": "Validation failed", "errors": ["title is required"] }
```

### Update a task
`PUT /api/tasks/:id`

Request body — any subset of `title`, `description`, `status`, `priority`:
```json
{ "status": "completed" }
```
- `200` on success, `400` invalid input, `404` if the task doesn't exist.

### Delete a task
`DELETE /api/tasks/:id`
- `200` on success:
```json
{ "success": true, "data": null, "message": "Task deleted successfully" }
```
- `404` if the task doesn't exist.

## 11. HTTP Status Codes Used

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Bad request / validation failure |
| 404 | Resource not found |
| 500 | Internal server error (raw errors are never exposed to the client) |

## 12. Testing the API

Every endpoint can be tested directly with `curl`, Postman, or Thunder
Client once the backend is running:

```bash
curl http://localhost:5000/api/tasks
curl http://localhost:5000/api/tasks/1
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task","description":"Testing POST","priority":"high"}'
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
curl -X DELETE http://localhost:5000/api/tasks/1
```

## 13. Future Improvements

- Authentication and per-user task ownership
- Pagination for large task lists
- Optional migration to SQLite + Prisma for relational querying
- Automated test suite (Jest/Supertest) for the API
- Dark mode and drag-and-drop status updates on the board

---

Built as part of the DecodeLabs Full Stack Development Industrial Training Kit, Batch 2026.
