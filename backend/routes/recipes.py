import json
from flask import Blueprint, request, jsonify
from database import get_db

recipes_bp = Blueprint("recipes", __name__)


def _serialize_recipe(row):
    r = dict(row)
    r["ingredients"] = json.loads(r.pop("ingredients_json"))
    r["steps"] = json.loads(r.pop("steps_json"))
    return r



def _match_score(recipe, fridge_set):

    ingredients = recipe["ingredients"]

    have = [
        i for i in ingredients
        if i.lower() in fridge_set
    ]

    missing = [
        i for i in ingredients
        if i.lower() not in fridge_set
    ]


    if ingredients:
        score = round(
            len(have) / len(ingredients) * 100
        )
    else:
        score = 0


    return score, missing


@recipes_bp.route("/api/recipes", methods=["GET"])
def list_recipes():

    conn = get_db()

    rows = conn.execute(
        "SELECT * FROM recipes ORDER BY name"
    ).fetchall()

    conn.close()

    return jsonify(
        [_serialize_recipe(r) for r in rows]
    )



@recipes_bp.route("/api/recipes/<int:recipe_id>", methods=["GET"])
def get_recipe(recipe_id):

    conn = get_db()

    row = conn.execute(
        "SELECT * FROM recipes WHERE id = ?",
        (recipe_id,)
    ).fetchone()


    if not row:
        conn.close()
        return jsonify(
            {"error":"Recipe not found"}
        ),404


    conn.execute(
        "INSERT INTO history(recipe_id) VALUES (?)",
        (recipe_id,)
    )

    conn.commit()
    conn.close()


    return jsonify(
        _serialize_recipe(row)
    )




@recipes_bp.route("/api/recipes/recommend", methods=["GET"])
def recommend_recipes():

    detected_foods = (
        request.args.get("detected_food") 
        or ""
    )


    fridge_set = {
        item.strip().lower()
        for item in detected_foods.split(",")
        if item.strip()
    }


    # tambahkan bahan kulkas dari database
    conn = get_db()

    fridge_rows = conn.execute(
        "SELECT name FROM ingredients"
    ).fetchall()


    fridge_set.update(
        row["name"].lower()
        for row in fridge_rows
    )


    all_recipes = conn.execute(
        "SELECT * FROM recipes"
    ).fetchall()


    conn.close()


    results = []


    for row in all_recipes:

        recipe = _serialize_recipe(row)


        score, missing = _match_score(
            recipe,
            fridge_set
        )


        is_primary_match = (
            recipe["main_ingredient"].lower()
            in fridge_set
        )


        results.append(
            {
                **recipe,

                "match_score": score,

                "missing_ingredients": missing,

                "is_primary_match": is_primary_match,

                "emoji": {
                    "egg":"🍳",
                    "chicken":"🍗",
                    "tofu":"🥢",
                    "spinach":"🥬",
                    "beef":"🥩",
                    "salmon":"🐟",
                    "tempeh":"🍘"
                }.get(
                    recipe["main_ingredient"],
                    "🍲"
                )
            }
        )


    results.sort(
    key=lambda r: -r["match_score"]
)


    return jsonify(results)