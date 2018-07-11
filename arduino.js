console.log("Lancé ! Récupération des données en cours...");

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600,
    parser: SerialPort.parsers.readline("\n")
});

port.on('open', function() {
    console.log('Serial Port Opened');

    port.on('data', function(data) {
        console.log(data);
    });
});

port.on('error', function(err) {
    console.log('Error: ', err.message);
});