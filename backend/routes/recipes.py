import json
from flask import Blueprint, request, jsonify
from database import get_db

recipes_bp = Blueprint("recipes", __name__)


def _serialize_recipe(row):
    r = dict(row)
    r["ingredients"] = json.loads(r.pop("ingredients_json"))
    r["steps"] = json.loads(r.pop("steps_json"))
    return r


def _match_score(recipe_ingredients, fridge_set):
    have = [i for i in recipe_ingredients if i in fridge_set]
    missing = [i for i in recipe_ingredients if i not in fridge_set]
    score = round(len(have) / len(recipe_ingredients) * 100) if recipe_ingredients else 0
    return score, missing


@recipes_bp.route("/api/recipes", methods=["GET"])
def list_recipes():
    conn = get_db()
    rows = conn.execute("SELECT * FROM recipes ORDER BY name").fetchall()
    conn.close()
    return jsonify([_serialize_recipe(r) for r in rows])


@recipes_bp.route("/api/recipes/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):
    conn = get_db()
    row = conn.execute("SELECT * FROM recipes WHERE id = ?", (recipe_id,)).fetchone()
    if not row:
        conn.close()
        return jsonify({"error": "Recipe not found"}), 404

    conn.execute(
        "INSERT INTO history (recipe_id) VALUES (?)", (recipe_id,)
    )
    conn.commit()
    conn.close()
    return jsonify(_serialize_recipe(row))


@recipes_bp.route("/api/recipes/recommend", methods=["GET"])
def recommend_recipes():
    detected_food = (request.args.get("detected_food") or "").strip().lower()

    conn = get_db()
    fridge_rows = conn.execute("SELECT name FROM ingredients").fetchall()
    fridge_set = {row["name"] for row in fridge_rows}

    if detected_food:
        fridge_set.add(detected_food)

    all_recipes = conn.execute("SELECT * FROM recipes").fetchall()
    conn.close()

    results = []
    for row in all_recipes:
        r = _serialize_recipe(row)
        score, missing = _match_score(r["ingredients"], fridge_set)

        # Recipes that use the detected food as their main ingredient are
        # boosted to the top, since that is the strongest signal we have.
        is_primary_match = detected_food and r["main_ingredient"] == detected_food
        results.append(
            {
                **r,
                "match_score": score,
                "missing_ingredients": missing,
                "is_primary_match": is_primary_match,
            }
        )

    results.sort(key=lambda r: (not r["is_primary_match"], -r["match_score"]))
    return jsonify(results)
