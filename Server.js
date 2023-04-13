var express = require("express"),
  app = express(),
  server = require("http").Server(app),
  io = require("socket.io")(server),
  port = 8888;

var CardDictionary = require("./CardDictionaryServer.js");

var state = {
  players: [
    {
      id: "1",
      card1: null,
      card2: null,
      percent: null,
    },
    {
      id: "2",
      card1: null,
      card2: null,
      percent: null,
    },
    {
      id: "3",
      card1: null,
      card2: null,
      percent: null,
    },
    {
      id: "4",
      card1: null,
      card2: null,
      percent: null,
    },
    {
      id: "5",
      card1: null,
      card2: null,
      percent: null,
    },
  ],
  communityCards: [],
};

var round = "Flop";

const antenna2Player = {
  1: 3,
  2: "",
  3: 2,
  4: 1,
  5: 4,
  6: 6,
  7: 7,
  8: 8,
};

function isCardStored(card) {
  let result = false;

  state.players.forEach((player) => {
    if (player.card1 === card || player.card2 === card) result = true;
  });

  if (state.communityCards.includes(card)) result = true;

  return result;
}

function clearAllCards() {
  state.players.forEach((player) => {
    player.card1 = null;
    player.card2 = null;
  });

  state.communityCards = [];

  io.emit("sendState", { state });
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
var cors = require("cors");
app.use(cors());
//Server start
server.listen(port, () => console.log("running on port: " + port));

//user server
app.use(express.static(__dirname + "/public"));

io.on("connection", onConnection);

var connectedSocket = null;
function onConnection(socket) {
  connectedSocket = socket;
  socket.on("roundChange", (data) => {
    round = data;
  });

  socket.on("clearAllCards", (data) => {
    clearAllCards();
  });
}

const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const serialport = new SerialPort.SerialPort({
  path: "/dev/cu.usbserial-AU02NFHO",
  // path: "/dev/cu.Pepper_C1-MUX-805930-SP",
  baudRate: 115200,
});
const parser = new Readline.ReadlineParser();
serialport.pipe(parser);

//----------

parser.on("data", (data) => {
  // console.log(data);
  const antenna = data.split("ANTENNA: ")[1][0];
  const cardUID = data.split("UID:")[1].split(";")[0];
  console.log(antenna, cardUID);

  const card = CardDictionary[cardUID];
  const player = antenna2Player[antenna];

  if (isCardStored(card)) return;

  if (player < 6) {
    const playerObj = state.players.find((obj) => obj.id == player);
    if (playerObj.card1 === null) {
      playerObj.card1 = card;
      io.emit("sendState", { state });
    } else if (playerObj.card2 === null) {
      playerObj.card2 = card;
      io.emit("sendState", { state });
    }
  } else if (
    round !== "Break" &&
    round !== "PreFlop" &&
    state.communityCards.length < 5
  ) {
    state.communityCards.push(card);
    io.emit("sendState", { state });
  }
});
