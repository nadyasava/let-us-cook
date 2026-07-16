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
    match_score INTEGER,
    missing_ingredients_json TEXT,
    is_primary_match INTEGER,
    UNIQUE(recipe_id)
);

CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    viewed_at TEXT DEFAULT CURRENT_TIMESTAMP
);
"""


def migrate_schema(conn):
    existing_columns = {row["name"] for row in conn.execute("PRAGMA table_info(favorites)")}
    migrations = {
        "match_score": "ALTER TABLE favorites ADD COLUMN match_score INTEGER",
        "missing_ingredients_json": "ALTER TABLE favorites ADD COLUMN missing_ingredients_json TEXT",
        "is_primary_match": "ALTER TABLE favorites ADD COLUMN is_primary_match INTEGER",
    }
    for column, statement in migrations.items():
        if column not in existing_columns:
            conn.execute(statement)
    conn.commit()


def init_db():
    is_new = not os.path.exists(DB_PATH)
    conn = get_db()
    conn.executescript(SCHEMA)
    conn.commit()

    migrate_schema(conn)

    if is_new:
        seed_recipes(conn)
    else:
        seed_recipes(conn, skip_existing=True)
    conn.close()


def seed_recipes(conn, skip_existing=False):
    if not os.path.exists(RECIPES_SEED_PATH):
        return
    with open(RECIPES_SEED_PATH, "r", encoding="utf-8") as f:
        recipes = json.load(f)

    existing_names = set()
    if skip_existing:
        existing_names = {
            row["name"] for row in conn.execute("SELECT name FROM recipes")
        }

    for r in recipes:
        if skip_existing and r["name"] in existing_names:
            continue
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
