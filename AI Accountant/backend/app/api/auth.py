from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext

from app.core.database import get_session
from app.models.models import User

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "super_secret_ledger_key" # In production, this should be in .env
ALGORITHM = "HS256"

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    company_name: str

class UserLogin(BaseModel):
    email: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/register")
def register(user_in: UserCreate, session: Session = Depends(get_session)):
    # Check if user exists
    existing_user = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    hashed_password = pwd_context.hash(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        name=user_in.name,
        company_name=user_in.company_name
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    
    # Generate token
    token = create_access_token(data={"sub": user.email, "name": user.name, "company": user.company_name})
    return {"access_token": token, "token_type": "bearer", "user": {"name": user.name, "email": user.email, "company": user.company_name}}

@router.post("/login")
def login(user_in: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == user_in.email)).first()
    if not user or not pwd_context.verify(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    token = create_access_token(data={"sub": user.email, "name": user.name, "company": user.company_name})
    return {"access_token": token, "token_type": "bearer", "user": {"name": user.name, "email": user.email, "company": user.company_name}}
