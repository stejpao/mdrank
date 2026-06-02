"""Database helpers for the scraper pipeline."""

from contextlib import contextmanager
from typing import Any, Generator

import psycopg
from psycopg.rows import dict_row

from config import DATABASE_URL


@contextmanager
def get_connection() -> Generator[psycopg.Connection, None, None]:
    conn = psycopg.connect(DATABASE_URL, row_factory=dict_row)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def fetch_one(conn: psycopg.Connection, query: str, params: tuple = ()) -> dict | None:
    cur = conn.execute(query, params)
    return cur.fetchone()


def fetch_all(conn: psycopg.Connection, query: str, params: tuple = ()) -> list[dict]:
    cur = conn.execute(query, params)
    return cur.fetchall()


def create_scrape_run(conn: psycopg.Connection) -> str:
    row = fetch_one(
        conn,
        "INSERT INTO scrape_runs (status) VALUES ('pending') RETURNING id::text",
    )
    return row["id"]


def finish_scrape_run(conn: psycopg.Connection, run_id: str, status: str, notes: str = "") -> None:
    conn.execute(
        """
        UPDATE scrape_runs
        SET finished_at = NOW(), status = %s::scrape_status, notes = %s
        WHERE id = %s::uuid
        """,
        (status, notes, run_id),
    )
