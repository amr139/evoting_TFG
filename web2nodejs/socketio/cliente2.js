const
    io = require("socket.io-client"),
    ioClient = io.connect("http://localhost:3001");

ioClient.on("123", (msg) => console.info(msg));