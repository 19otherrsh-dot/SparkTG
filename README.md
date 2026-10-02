# SparkTG

| Path | What it is | Stack |
|------|------------|-------|
| `frontend/` | SparkTG Nexus dashboard | React + Vite |
| `backend/` | SparkTG Nexus API (port 3001) | Express + Prisma (SQLite) + Socket.IO |
| `AI Accountant/ledgerai/` | LedgerAI web app (port 3000) | Next.js |
| `AI Accountant/backend/` | LedgerAI API | FastAPI + SQLModel + Gemini |
| `AI Accountant/src/` | Earlier copy of the LedgerAI UI pages | — |

## Setup on a new machine

Requirements: Node.js 20+, npm, Python 3.13, Git.

### 1. Environment files

`.env` files are gitignored. Copy each template and fill in secrets:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp "AI Accountant/backend/.env.example" "AI Accountant/backend/.env"   # set GEMINI_API_KEY
```

### 2. SparkTG Nexus (frontend + backend)

```bash
npm install                       # root workspaces: frontend + backend
npx prisma generate --schema backend/prisma/schema.prisma
npm run dev                       # runs frontend and backend together
```

The backend seeds demo users on first start: `admin@sparktg.com` / `agent@sparktg.com`, password `password123`.

### 3. AI Accountant — backend

```bash
cd "AI Accountant/backend"
python -m venv venv
venv\Scripts\activate             # Windows  (macOS/Linux: source venv/bin/activate)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. AI Accountant — LedgerAI web

```bash
cd "AI Accountant/ledgerai"
npm install
npm run dev
```
