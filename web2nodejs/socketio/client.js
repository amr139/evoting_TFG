const
    io = require("socket.io-client"),
    ioClient = io.connect("http://localhost:3001");

ioClient.emit("webhook", {room: "f138d72d-009e-4cbf-a23e-75f9ee1432a9", data: "pepe"});