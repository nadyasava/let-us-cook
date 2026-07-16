import json
from flask import Blueprint, jsonify
from database import get_db

favorites_bp = Blueprint("favorites", __name__)


def _serialize_recipe(row):
    r = dict(row)
    r["ingredients"] = json.loads(r.pop("ingredients_json"))
    r["steps"] = json.loads(r.pop("steps_json"))
    return r


@favorites_bp.route("/api/favorites", methods=["GET"])
def list_favorites():
    conn = get_db()
    rows = conn.execute(
        """SELECT r.* FROM recipes r
           JOIN favorites f ON f.recipe_id = r.id
           ORDER BY f.created_at DESC"""
    ).fetchall()
    conn.close()
    return jsonify([_serialize_recipe(r) for r in rows])


@favorites_bp.route("/api/favorites/<int:recipe_id>", methods=["POST"])
def add_favorite(recipe_id):
    conn = get_db()
    recipe = conn.execute("SELECT id FROM recipes WHERE id = ?", (recipe_id,)).fetchone()
    if not recipe:
        conn.close()
        return jsonify({"error": "Recipe not found"}), 404

    conn.execute(
        "INSERT OR IGNORE INTO favorites (recipe_id) VALUES (?)", (recipe_id,)
    )
    conn.commit()
    conn.close()
    return jsonify({"favorited": recipe_id})


@favorites_bp.route("/api/favorites/<int:recipe_id>", methods=["DELETE"])
def remove_favorite(recipe_id):
    conn = get_db()
    conn.execute("DELETE FROM favorites WHERE recipe_id = ?", (recipe_id,))
    conn.commit()
    conn.close()
    return jsonify({"unfavorited": recipe_id})


@favorites_bp.route("/api/history", methods=["GET"])
def list_history():
    conn = get_db()
    rows = conn.execute(
        """SELECT r.*, h.viewed_at FROM recipes r
           JOIN history h ON h.recipe_id = r.id
           ORDER BY h.viewed_at DESC LIMIT 50"""
    ).fetchall()
    conn.close()
    return jsonify([_serialize_recipe(r) for r in rows])
