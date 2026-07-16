import sqlite3
import json
import os
from config import DB_PATH, RECIPES_SEED_PATH


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


SCHEMA = """
CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    quantity REAL DEFAULT 1,
    unit TEXT DEFAULT 'pcs',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    main_ingredient TEXT NOT NULL,
    cook_time_minutes INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    calories INTEGER,
    protein_g REAL,
    carbs_g REAL,
    fat_g REAL,
    ingredients_json TEXT NOT NULL,
    steps_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(recipe_id)
);

CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    viewed_at TEXT DEFAULT CURRENT_TIMESTAMP
);
"""


def init_db():
    is_new = not os.path.exists(DB_PATH)
    conn = get_db()
    conn.executescript(SCHEMA)
    conn.commit()

    if is_new:
        seed_recipes(conn)
    conn.close()


def seed_recipes(conn):
    if not os.path.exists(RECIPES_SEED_PATH):
        return
    with open(RECIPES_SEED_PATH, "r", encoding="utf-8") as f:
        recipes = json.load(f)

    for r in recipes:
        conn.execute(
            """INSERT INTO recipes
               (name, main_ingredient, cook_time_minutes, difficulty,
                calories, protein_g, carbs_g, fat_g, ingredients_json, steps_json)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                r["name"],
                r["main_ingredient"],
                r["cook_time_minutes"],
                r["difficulty"],
                r["calories"],
                r["protein_g"],
                r["carbs_g"],
                r["fat_g"],
                json.dumps(r["ingredients"]),
                json.dumps(r["steps"]),
            ),
        )
    conn.commit()
