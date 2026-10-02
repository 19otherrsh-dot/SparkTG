from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class Conversation(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = "New Conversation"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    messages: List["ChatMessage"] = Relationship(back_populates="conversation")

class ChatMessage(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversation.id")
    role: str # 'user', 'ai', 'system'
    content: str
    agent_name: Optional[str] = None
    agent_emoji: Optional[str] = None
    data_card_title: Optional[str] = None
    data_card_value: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    conversation: Conversation = Relationship(back_populates="messages")

class TransactionBase(SQLModel):
    description: str
    amount: float
    category: Optional[str] = None
    type: str # 'Credit' or 'Debit'
    status: str
    is_categorized: bool = False
    date: datetime = Field(default_factory=datetime.utcnow)

class Transaction(TransactionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class Metric(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    value: str
    change: str
    changeType: str
    icon: str

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    name: str
    company_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
