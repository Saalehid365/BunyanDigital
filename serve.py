import functools
import http.server
import socketserver

ROOT = "/Users/anthony.nelson/Desktop/Claude Ai/bunyan-digital"
PORT = 8642

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)

with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    httpd.serve_forever()
