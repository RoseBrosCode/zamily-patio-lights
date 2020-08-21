from pythonosc import osc_server, dispatcher, udp_client
import threading


class OSCClient:
    def __init__(self, local_host="127.0.0.1", local_port=5000, remote_host="127.0.0.1", remote_port=5001):
        self.local_host = local_host
        self.local_port = local_port
        self.remote_host = remote_host
        self.remote_port = remote_port
        self.dispatcher = dispatcher.Dispatcher()
        self.server = None
        self.server_thread = None
        self.client = udp_client.SimpleUDPClient(self.remote_host, self.remote_port)

    def start(self):
        self.server = osc_server.ThreadingOSCUDPServer((self.local_host, self.local_port), self.dispatcher)
        self.server_thread = threading.Thread(target=self.server.serve_forever).start()
        print("Listening on %s:%d, sending to %s:%d" % (self.local_host, self.local_port, self.remote_host, self.remote_port))

    def register(self, address, func):
        self.dispatcher.map(address, func)

    def send(self, address, args):
        self.client.send_message(address, args)
