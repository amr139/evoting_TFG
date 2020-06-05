const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('conectado ', socket.id)
    socket.on("webhook", data => {
        io.emit(data.room,data.data);
    })
});

server.listen(3001);