import os
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from database import init_db
from routes.detect import detect_bp
from routes.ingredients import ingredients_bp
from routes.recipes import recipes_bp
from routes.favorites import favorites_bp

FRONTEND_DIST = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist"
)


def create_app():
    app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path="")
    CORS(app)

    app.register_blueprint(detect_bp)
    app.register_blueprint(ingredients_bp)
    app.register_blueprint(recipes_bp)
    app.register_blueprint(favorites_bp)

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok", "service": "letuscook-backend"})

    # Serve the built React app for any non-API route, so Flask can host
    # both the API and the frontend from a single deployment.
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        if not os.path.isdir(app.static_folder):
            return jsonify({"error": "Frontend build not found. Run 'npm run build' in frontend/."}), 404

        full_path = os.path.join(app.static_folder, path)
        if path and os.path.isfile(full_path):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, "index.html")

    return app


init_db()
app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
