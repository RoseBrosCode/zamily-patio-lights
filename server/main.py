from flask import Flask, request, jsonify

app = Flask(__name__, static_folder='../client/build', static_url_path='/')

@app.route('/')
def index():
    """Serves the HTML entrypoint to the React app."""
    return app.send_static_file('index.html')


@app.route('/state', methods=['GET'])
def get_state():
    return jsonify({
        "stringsOn": False,
        "grillOn": False,
        "animation": 1,
        "red": 252,
        "green": 101,
        "blue": 20,
        "speed": 5,
        "direction": 0,
        "density": 0.5,
        "tailLength": 250
    }), 200


@app.route('/animation', methods=['POST'])
def update_animation_state():
    app.logger.info(f"animation update: {request.json}")
    return '', 200


@app.route('/lights', methods=['POST'])
def update_lights_state():
    app.logger.info(f"lights update: {request.json}")
    return '', 200
