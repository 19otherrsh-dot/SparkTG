from sqlmodel import SQLModel, create_engine, Session
from .config import settings

# In PostgreSQL, we often use psycopg2 or asyncpg. Here we use psycopg2.
# Note: Ensure the database exists in PostgreSQL before running this.
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(settings.DATABASE_URL, echo=True, connect_args=connect_args)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
