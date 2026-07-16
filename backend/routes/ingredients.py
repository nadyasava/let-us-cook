from flask import Blueprint, request, jsonify
from database import get_db

ingredients_bp = Blueprint("ingredients", __name__)


@ingredients_bp.route("/api/ingredients", methods=["GET"])
def list_ingredients():
    conn = get_db()
    rows = conn.execute("SELECT * FROM ingredients ORDER BY name").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@ingredients_bp.route("/api/ingredients", methods=["POST"])
def add_ingredient():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip().lower()
    quantity = data.get("quantity", 1)
    unit = (data.get("unit") or "pcs").strip()

    if not name:
        return jsonify({"error": "Field 'name' is required"}), 400

    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO ingredients (name, quantity, unit) VALUES (?, ?, ?)",
            (name, quantity, unit),
        )
        conn.commit()
    except conn.IntegrityError:
        conn.close()
        return jsonify({"error": f"Ingredient '{name}' already exists"}), 409

    new_row = conn.execute(
        "SELECT * FROM ingredients WHERE name = ?", (name,)
    ).fetchone()
    conn.close()
    return jsonify(dict(new_row)), 201


@ingredients_bp.route("/api/ingredients/<int:ingredient_id>", methods=["PUT"])
def update_ingredient(ingredient_id):
    data = request.get_json(silent=True) or {}
    conn = get_db()
    existing = conn.execute(
        "SELECT * FROM ingredients WHERE id = ?", (ingredient_id,)
    ).fetchone()
    if not existing:
        conn.close()
        return jsonify({"error": "Ingredient not found"}), 404

    name = (data.get("name") or existing["name"]).strip().lower()
    quantity = data.get("quantity", existing["quantity"])
    unit = (data.get("unit") or existing["unit"]).strip()

    conn.execute(
        "UPDATE ingredients SET name = ?, quantity = ?, unit = ? WHERE id = ?",
        (name, quantity, unit, ingredient_id),
    )
    conn.commit()
    updated = conn.execute(
        "SELECT * FROM ingredients WHERE id = ?", (ingredient_id,)
    ).fetchone()
    conn.close()
    return jsonify(dict(updated))


@ingredients_bp.route("/api/ingredients/<int:ingredient_id>", methods=["DELETE"])
def delete_ingredient(ingredient_id):
    conn = get_db()
    existing = conn.execute(
        "SELECT * FROM ingredients WHERE id = ?", (ingredient_id,)
    ).fetchone()
    if not existing:
        conn.close()
        return jsonify({"error": "Ingredient not found"}), 404

    conn.execute("DELETE FROM ingredients WHERE id = ?", (ingredient_id,))
    conn.commit()
    conn.close()
    return jsonify({"deleted": ingredient_id})
