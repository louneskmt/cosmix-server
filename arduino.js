/*
Fichier "arduino.js"
Gestion de la récupération des données sur le port Serial et écriture dans un fichier

Dernière modification par Lounès le 11/07
*/

// Message de lancement
console.log("Lancé ! Récupération des données en cours...");

// Module de création et d'écriture dans un fichier et gestion de la date
var fs = require("fs");
var now = new Date();
var file_name = "./experiments_files/Experiment-" + now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate() + "-" + now.getHours() + "-" + now.getMinutes() +'.csmx';
fs.writeFileSync(file_name, "Mesure\n", "UTF-8");

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