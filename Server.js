var express = require("express"),
  app = express(),
  server = require("http").Server(app),
  io = require("socket.io")(server),
  port = 8888;

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
}

const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const serialport = new SerialPort.SerialPort({
  path: "/dev/cu.usbserial-AU02NFHO",
  baudRate: 115200,
});
const parser = new Readline.ReadlineParser();
serialport.pipe(parser);
parser.on("data", (data) => {
  var splitData = data.split("UID: ")[1];
  var uid = splitData.split(",")[0];
  var antenna = splitData.split(", antenna: ")[1];
  console.log("uid: ", uid);
  console.log("antenna: ", antenna);
  io.emit("serialdata", { uid, antenna });
});
