// const SerialPort = require("serialport");
// const Readline = require("@serialport/parser-readline");
// const port = new SerialPort.SerialPort({
//   path: "/dev/cu.usbserial-AU02NFHO",
//   baudRate: 115200,
// });
// const parser = new Readline.ReadlineParser();
// port.pipe(parser);

// parser.on("data", (data) => {
//   //  console.log(data)

//   var splitData = data.split("UID: ")[1];
//   var uid = splitData.split(",")[0];
//   var antenna = splitData.split(", antenna: ")[1];
//   console.log("uid: ", uid);
//   console.log("antenna: ", antenna);
// });
