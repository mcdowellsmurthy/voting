from flask import Flask, render_template, request, make_response, g
from redis import Redis
import os
import socket
import random
import json
import logging

option_bloc = os.getenv('OPTION_BLOC', "Bloc")
option_consv = os.getenv('OPTION_CONSV', "Conservative")
option_lib = os.getenv('OPTION_LIB', "Liberal")
option_ndp = os.getenv('OPTION_NDP', "NDP")
option_other = os.getenv('OPTION_OTHER', "Other")
option_none = os.getenv('OPTION_NONE', "Not_Voting")

hostname = socket.gethostname()

app = Flask(__name__)

gunicorn_error_logger = logging.getLogger('gunicorn.error')
app.logger.handlers.extend(gunicorn_error_logger.handlers)
app.logger.setLevel(logging.INFO)

def get_redis():
    if not hasattr(g, 'redis'):
        g.redis = Redis(host="redis", db=0, socket_timeout=5)
    return g.redis

@app.route("/", methods=['POST','GET'])
def hello():
    voter_id = request.cookies.get('voter_id')
    if not voter_id:
        voter_id = hex(random.getrandbits(64))[2:-1]

    vote = None

    if request.method == 'POST':
        redis = get_redis()
        vote = request.form['vote']
        app.logger.info('Received vote for %s', vote)
        data = json.dumps({'voter_id': voter_id, 'vote': vote})
        redis.rpush('votes', data)

    resp = make_response(render_template(
        'index.html',
        option_bloc=option_bloc,
        option_consv=option_consv,
        option_lib=option_lib,
        option_ndp=option_ndp,
        option_other=option_other,
        option_none=option_none,
        hostname=hostname,
        vote=vote,
    ))
    resp.set_cookie('voter_id', voter_id)
    return resp


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80, debug=True, threaded=True)
