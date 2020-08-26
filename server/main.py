from flask import Flask, request

app = Flask(__name__, static_folder='../client/build', static_url_path='/')

@app.route('/')
def index():
    """Serves the HTML entrypoint to the React app."""
    return app.send_static_file('index.html')

@app.route('/animation', methods=['POST'])
def update_animation_state():
    app.logger.info(f"animation update: {request.json}")
    return '', 200