from typing import Generator
import serial
import re
from cards import card_map, CardEvent, UidNotFound
import serial
import logging

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel(logging.NOTSET)


MAX_BUF_LEN = 256
antenna_pat = re.compile(b'antenna:\s(\d+)')
uid_pat = re.compile(b'UID:\s([0-9A-F]+),')

SAMPLE_LINE = \
    '\x1b[0;32mI (2258573) rfid: Card nr 0 - ICODE SLIX, brand: NXP Semiconductors, DSFID: 0, UID: E0040150BA544336, antenna: 3\x1b[0m\r\n'

def init_serial():
    ser = serial.Serial('/dev/cu.usbserial-AU02NFHO') 
    ser.baudrate = 115200
    return ser


def parse_rfid_line(line: bytes):
    antenna = antenna_pat.findall(line)[0].decode()
    uid = uid_pat.findall(line)[0].decode()
    card = card_map.get(uid)
    if card is None:
        raise UidNotFound(f"Unrecognized uid: {uid}")
    return CardEvent(card=card, antenna=antenna)

def parse_rfid_stream(bytestream):
    lines = bytestream.split(b'\n') if bytestream else []
    return (parse_rfid_line(line) for line in lines)


def read_rfid_data() -> Generator[CardEvent, None, None]:
    ser = init_serial()
    while(True):
        line = ser.readline(MAX_BUF_LEN)
        try:
            yield parse_rfid_line(line)
        except Exception as e:
            logging.error(e)
            logging.debug(line)





