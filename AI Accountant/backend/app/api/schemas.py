from pydantic import BaseModel
from typing import List, Optional

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    conversation_id: Optional[int] = None
    messages: List[Message]
    
class AgentData(BaseModel):
    title: Optional[str] = None
    value: Optional[str] = None
    # Add other fields depending on the widget we want to return

class ChatResponse(BaseModel):
    conversation_id: int
    agent_name: str
    icon: str
    message: str
    data_card: Optional[AgentData] = None
