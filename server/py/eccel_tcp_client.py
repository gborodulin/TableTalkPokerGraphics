import string
import json
import socket
from typing import Generator
from cards import card_map, CardEvent
from cards import UidNotFound
import logging
logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.NOTSET)



LOCAL_ECCEL_IP = '192.168.0.189'
LOCAL_ECCEL_TCP_PORT = 1234

def parse_jsons_from_batch(data: bytes):
    data = data.decode() # turn bytes -> str
    data = data.translate(str.maketrans('', '', string.whitespace)) # remove all whitespace
    data = data.replace('}{','}\n{') # if there is more than one json object in the datastream, put a newline between objects
    return [json.loads(event) for event in data.split('\n')]
    
def process_event(event: dict):
    uid, antenna = event['uid'], event['antenna']
    card = card_map.get(uid)
    if not card:
        raise UidNotFound
    event = CardEvent(card,antenna)
    return event


def init_socket() -> socket.socket:
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((LOCAL_ECCEL_IP,LOCAL_ECCEL_TCP_PORT))
    logger.info("Connected to socket")
    sock.settimeout(3)
    return sock

def read_rfid_data() -> Generator[CardEvent, None, None]:
    sock = init_socket()
    while(True):
        try:
            polled_data = sock.recv(1024)
        except Exception as e:
            logger.error(e)
            logger.info("Retrying a new socket connection")
            sock = init_socket()
            continue
        try:
            events = parse_jsons_from_batch(polled_data)
            for event in events:
                yield process_event(event)
        except Exception as e:
            logger.error(e)
            logger.error(polled_data)



