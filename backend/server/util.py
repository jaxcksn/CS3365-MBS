from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import Any, Dict, List, Optional
from fastapi import HTTPException
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# -------------------------- Module Level Variables -------------------------- #
load_dotenv()

DB_USER = os.getenv("DATABASE_USER")
DB_PASSWORD = os.getenv("DATABASE_PASSWORD")
DB_HOST = os.getenv("DATABASE_HOST", "localhost")
DB_URL = f"mysql+asyncmy://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:3306/mbs"

engine = create_async_engine(DB_URL, echo=False)
async_session_factory = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


# ------------------- Helper Class for Database Operations ------------------- #
class DB:
    """
    Helper class for database operations, abstracting away the database connection and session management.
    Uses SqlAlchemy Core for SQL queries under the hood.

    Should be used entirely statically, do not instantiate.
    """

    @staticmethod
    @asynccontextmanager
    async def get_session():
        async with async_session_factory() as session:
            yield session

    @staticmethod
    async def queryOne(
        sql: str, params: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Executes a SQL select statement. Do not use for anything that changes the database.

        :param db: AsyncSession instance
        :param sql: SQL query string
        :param params: Dictionary of query parameters
        :return: Single row as dictionary or None if no result
        """
        async with DB.get_session() as db:
            try:
                result = await db.execute(text(sql), params)
                row = result.mappings().first()
                return dict(row) if row else None
            except Exception as err:
                raise HTTPException(status_code=500, detail=str(err))

    @staticmethod
    async def query(
        sql: str, params: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Executes a SQL select statement. Do not use for anything that changes the database.

        :param db: AsyncSession instance
        :param sql: SQL query string
        :param params: Dictionary of query parameters
        :return: List of rows as dictionaries
        """
        async with DB.get_session() as db:
            try:
                result = await db.execute(text(sql), params)
                rows = result.mappings().all()
                return [dict(row) for row in rows]
            except Exception as err:
                raise HTTPException(status_code=500, detail=str(err))

    @staticmethod
    async def execute(sql: str, params: Optional[Dict[str, Any]] = None) -> None:
        """
        Executes a SQL statement that changes the database. Do not use for select statements.

        :param db: AsyncSession instance
        :param sql: SQL query string
        :param params: Dictionary of query parameters
        """
        async with DB.get_session() as db:
            try:
                await db.execute(text(sql), params)
                await db.commit()
            except Exception as err:
                await db.rollback()
                raise HTTPException(status_code=500, detail=str(err))
