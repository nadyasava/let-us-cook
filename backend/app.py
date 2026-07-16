from flask import Flask, jsonify
from flask_cors import CORS

from database import init_db
from routes.detect import detect_bp
from routes.ingredients import ingredients_bp
from routes.recipes import recipes_bp
from routes.favorites import favorites_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(detect_bp)
    app.register_blueprint(ingredients_bp)
    app.register_blueprint(recipes_bp)
    app.register_blueprint(favorites_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "letuscook-backend"})

    return app


app = create_app()

if __name__ == "__main__":
    init_db()
    app.run(debug=True, port=5000)
