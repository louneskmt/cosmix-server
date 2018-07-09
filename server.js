const server = require('http').createServer();

// Chargement de socket.io
var io = require('socket.io').listen(server);
console.log('Serveur créé !');

// Quand un client se connecte, on le note dans la console
io.on('connection', function (socket) {
    console.log('Un client est connecté !');
});


server.listen(8080);