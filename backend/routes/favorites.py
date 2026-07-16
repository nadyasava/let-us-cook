import json
from flask import Blueprint, jsonify, request
from database import get_db

favorites_bp = Blueprint("favorites", __name__)


def _serialize_recipe(row):
    r = dict(row)
    r["ingredients"] = json.loads(r.pop("ingredients_json"))
    r["steps"] = json.loads(r.pop("steps_json"))
    return r


def _serialize_favorite(row):
    r = _serialize_recipe(row)
    r["match_score"] = row["match_score"] if row["match_score"] is not None else 0
    r["missing_ingredients"] = (
        json.loads(row["missing_ingredients_json"])
        if row["missing_ingredients_json"]
        else []
    )
    r["is_primary_match"] = bool(row["is_primary_match"])
    r.pop("missing_ingredients_json", None)
    return r


@favorites_bp.route("/api/favorites", methods=["GET"])
def list_favorites():
    conn = get_db()
    rows = conn.execute(
        """SELECT r.*, f.match_score, f.missing_ingredients_json, f.is_primary_match
           FROM recipes r
           JOIN favorites f ON f.recipe_id = r.id
           ORDER BY f.created_at DESC"""
    ).fetchall()
    conn.close()
    return jsonify([_serialize_favorite(r) for r in rows])


@favorites_bp.route("/api/favorites/<int:recipe_id>", methods=["POST"])
def add_favorite(recipe_id):
    conn = get_db()
    recipe = conn.execute("SELECT id FROM recipes WHERE id = ?", (recipe_id,)).fetchone()
    if not recipe:
        conn.close()
        return jsonify({"error": "Recipe not found"}), 404

    body = request.get_json(silent=True) or {}
    match_score = body.get("match_score", 0)
    missing_ingredients = json.dumps(body.get("missing_ingredients", []))
    is_primary_match = 1 if body.get("is_primary_match") else 0

    conn.execute(
        """INSERT INTO favorites (recipe_id, match_score, missing_ingredients_json, is_primary_match)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(recipe_id) DO UPDATE SET
             match_score = excluded.match_score,
             missing_ingredients_json = excluded.missing_ingredients_json,
             is_primary_match = excluded.is_primary_match""",
        (recipe_id, match_score, missing_ingredients, is_primary_match),
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
