from fastapi import APIRouter, Depends
from sqlmodel import Session
from datetime import datetime

from app.core.database import get_session
from app.models.models import Transaction

router = APIRouter()

@router.post("/bank")
async def simulate_bank_webhook(session: Session = Depends(get_session)):
    """Simulates receiving new raw transactions from a bank/payment gateway"""
    
    new_txns = [
        Transaction(
            description="AWS EMEA",
            amount=14500.0,
            type="Debit",
            status="Completed",
            is_categorized=False
        ),
        Transaction(
            description="Razorpay Settlement #8291",
            amount=850000.0,
            type="Credit",
            status="Completed",
            is_categorized=False
        ),
        Transaction(
            description="WeWork India - July",
            amount=45000.0,
            type="Debit",
            status="Completed",
            is_categorized=False
        ),
        Transaction(
            description="Google Cloud Services",
            amount=8200.0,
            type="Debit",
            status="Completed",
            is_categorized=False
        ),
        Transaction(
            description="Contractor Payout - Rajesh",
            amount=50000.0,
            type="Debit",
            status="Completed",
            is_categorized=False
        )
    ]
    
    for txn in new_txns:
        session.add(txn)
        
    session.commit()
    
    return {"message": f"Successfully ingested {len(new_txns)} new uncategorized transactions."}
