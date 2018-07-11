console.log("Lancé ! Récupération des données en cours...");

var fs = require("fs");
fs.writeFileSync("./lastest_experiment.csmx", "Mesure", "UTF-8");

var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
var port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
});
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

port.on('open', function() {
    console.log('Serial Port Opened');

    parser.on('data', function(data) {
        console.log(data);
        fs.appendFileSync('./lastest_experiment.csmx', data);
        fs.appendFileSync('./lastest_experiment.csmx', '\n');
    });
});

port.on('error', function(err) {
    console.log('Error: ', err.message);
});