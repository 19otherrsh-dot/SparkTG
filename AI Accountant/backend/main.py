from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from contextlib import asynccontextmanager
from typing import List

from app.core.database import create_db_and_tables, get_session
from app.core.config import settings
from app.models.models import Transaction, Metric
from app.api import chat, webhooks, auth
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan, title="LedgerAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(webhooks.router, prefix="/api/webhooks", tags=["webhooks"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])

@app.get("/api/metrics")
def get_metrics(session: Session = Depends(get_session)):
    metrics = session.exec(select(Metric)).all()
    # Return mock data if db is empty
    if not metrics:
        return [
            {"title": "Revenue MTD", "value": "₹42.5L", "change": "+12.3%", "changeType": "up", "icon": "📊"},
            {"title": "Net Profit", "value": "₹8.2L", "change": "+5.7%", "changeType": "up", "icon": "💰"},
            {"title": "Cash Balance", "value": "₹1.24Cr", "change": "Stable", "changeType": "neutral", "icon": "💵"},
            {"title": "GST Due", "value": "₹3.2L", "change": "Due Jul 20", "changeType": "neutral", "icon": "📋"},
            {"title": "TDS Due", "value": "₹1.8L", "change": "Due Jul 7", "changeType": "down", "icon": "🏦"},
            {"title": "Runway", "value": "14.3mo", "change": "+0.8mo", "changeType": "up", "icon": "📈"},
        ]
    return metrics

@app.get("/api/transactions")
def get_transactions(session: Session = Depends(get_session)):
    txs = session.exec(select(Transaction)).all()
    if not txs:
        return [
            {"date": "Jun 19, 2026", "description": "Razorpay Settlement", "category": "Revenue", "amount": "₹4,82,000", "type": "Credit", "status": "completed"},
            {"date": "Jun 18, 2026", "description": "AWS Services", "category": "Infrastructure", "amount": "₹1,24,500", "type": "Debit", "status": "completed"},
            {"date": "Jun 18, 2026", "description": "Google Ads", "category": "Marketing", "amount": "₹85,000", "type": "Debit", "status": "completed"},
        ]
    return txs
