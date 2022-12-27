import flask
import threading
from eccel_tcp_client import read_rfid_data
from cards import CardEvent
from collections import defaultdict
import json
import logging
from flask_sock import Sock
import time

logging.basicConfig()
app = flask.Flask(__name__)
sock = Sock(app)


game_state = defaultdict(set)

def update_game_state():
    global game_state
    for event in read_rfid_data():
        card, antenna = event

        # remove the card we just found from any other antennas it may have been caught by
        for cards in game_state.values():
            cards.discard(card)
        
        # add the card to the state using the current antenna as a key
        game_state[antenna].add(card)


# TODO figure out how to do this async or what the best way to do this is
# you need to only send websocket on udpates to game state
def yield_game_state():
    pass

    

def serialize_sets(obj):
    if isinstance(obj, set):
        return sorted(list(obj))
    return obj

def serialize_game_state():
    return json.dumps(game_state, default=serialize_sets)

@app.get('/')
def get_data():
    return serialize_game_state()
    
@sock.route('/game_state')
def ws_game_state(ws):
    while True:
        ws.send(serialize_game_state())
        time.sleep(0.2)


t=threading.Thread(target=update_game_state)
t.start()
app.run(host='0.0.0.0',port=47479, debug=True)