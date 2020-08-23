from flask import Flask

app = Flask(__name__, static_folder='../client/build', static_url_path='/')

@app.route('/')
def index():
    """Serves the HTML entrypoint to the React app."""
    return app.send_static_file('index.html')

