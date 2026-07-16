from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "Let Us Cook API is running 🔥"
    })


@app.route("/recipes")
def recipes():
    return jsonify([
        {
            "name": "Chicken Fried Rice",
            "ingredients": [
                "rice",
                "egg",
                "chicken"
            ],
            "calories": 450,
            "protein": "25g"
        },
        {
            "name": "Vegetable Omelette",
            "ingredients": [
                "egg",
                "vegetable"
            ],
            "calories": 300,
            "protein": "18g"
        }
    ])


if __name__ == "__main__":
    app.run(debug=True)