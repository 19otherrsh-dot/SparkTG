# SparkTG

| Path | What it is | Stack | URL |
|------|------------|-------|-----|
| `frontend/` | SparkTG Nexus dashboard | React + Vite | http://localhost:5173 |
| `backend/` | SparkTG Nexus API | Fastify + Prisma (SQLite) + Socket.IO | http://localhost:3001 |
| `AI Accountant/ledgerai/` | LedgerAI web app | Next.js 16 | http://localhost:3000 |
| `AI Accountant/backend/` | LedgerAI API | FastAPI + SQLModel + Gemini | http://localhost:8000 |
| `AI Accountant/src/` | Earlier copy of the LedgerAI UI pages (not run) | — | — |

## Setup on a new machine

Install first: [Git](https://git-scm.com/download/win), [Node.js 20.9+](https://nodejs.org) (LTS), [Python 3.13](https://www.python.org/downloads/) (tick "Add python.exe to PATH").

### 1. Clone

```bash
git clone https://github.com/19otherrsh-dot/SparkTG.git
cd SparkTG
```

### 2. Environment files

`.env` files are gitignored. Copy each template, then put your Gemini key into `AI Accountant/backend/.env`:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp "AI Accountant/backend/.env.example" "AI Accountant/backend/.env"
```

### 3. SparkTG Nexus (frontend + backend)

```bash
npm install                        # installs root, frontend and backend (npm workspaces)
cd backend && npx prisma generate && cd ..
npm run dev                        # starts frontend and backend together
```

Login: `admin@sparktg.com` or `agent@sparktg.com`, password `password123`.

### 4. AI Accountant — backend

```bash
cd "AI Accountant/backend"
python -m venv venv
venv\Scripts\python -m pip install -r requirements.txt       # macOS/Linux: venv/bin/python
venv\Scripts\python -m uvicorn main:app --reload --port 8000
```

### 5. AI Accountant — LedgerAI web (new terminal)

```bash
cd "AI Accountant/ledgerai"
npm install
npm run dev
```
