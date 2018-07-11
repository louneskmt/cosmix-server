console.log("Lancé ! Récupération des données en cours...");

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0');

port.on('open', function() {
    console.log('Serial Port Opened');

    /*
    port.on('data', function(data) {
        // console.log(data);
        console.log(data[0]);
    });
    */

    port.on('readable', function() {
        console.log(port.read());
    });
});

port.on('error', function(err) {
    console.log('Error: ', err.message);
});