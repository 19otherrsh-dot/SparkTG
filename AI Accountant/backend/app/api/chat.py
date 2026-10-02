from fastapi import APIRouter, Depends, Request
from sqlmodel import Session, select
from typing import List
import json
import base64

from app.api.schemas import ChatRequest, ChatResponse
from app.services.llm import process_chat
from app.core.database import get_session
from app.models.models import Conversation, ChatMessage

router = APIRouter()

@router.get("/history/{conversation_id}")
async def get_chat_history(conversation_id: int, session: Session = Depends(get_session)):
    conversation = session.get(Conversation, conversation_id)
    if not conversation:
        return []
    return conversation.messages

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: Request, session: Session = Depends(get_session)):
    content_type = request.headers.get("Content-Type", "")
    
    last_message = ""
    conversation_id = None
    image_b64 = None
    
    if "multipart/form-data" in content_type:
        form = await request.form()
        text_payload = form.get("payload")
        if text_payload:
            payload = json.loads(text_payload)
            msgs = payload.get("messages", [])
            last_message = msgs[-1].get("content", "") if msgs else ""
            conversation_id = payload.get("conversation_id")
            
        file = form.get("file")
        if file and hasattr(file, "file"):
            image_bytes = await file.read()
            image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    else:
        payload = await request.json()
        msgs = payload.get("messages", [])
        last_message = msgs[-1].get("content", "") if msgs else ""
        conversation_id = payload.get("conversation_id")
    
    # 1. Fetch or create Conversation
    if conversation_id:
        conversation = session.get(Conversation, conversation_id)
        if not conversation:
            conversation = Conversation()
            session.add(conversation)
            session.commit()
            session.refresh(conversation)
    else:
        conversation = Conversation()
        session.add(conversation)
        session.commit()
        session.refresh(conversation)
    
    # 2. Save user message
    user_msg = ChatMessage(
        conversation_id=conversation.id,
        role="user",
        content=last_message
    )
    session.add(user_msg)
    session.commit()
    
    # 3. Process it via LLM (We pass the session to allow LLM tools to access DB)
    response_data = await process_chat(last_message, session, image_b64)
    
    # 4. Save AI message
    data_card = response_data.get("data_card", {})
    ai_msg = ChatMessage(
        conversation_id=conversation.id,
        role="ai",
        content=response_data.get("message", ""),
        agent_name=response_data.get("agent_name"),
        agent_emoji=response_data.get("icon"),
        data_card_title=data_card.get("title") if data_card else None,
        data_card_value=data_card.get("value") if data_card else None,
    )
    session.add(ai_msg)
    session.commit()
    
    response_data["conversation_id"] = conversation.id
    
    return ChatResponse(**response_data)
