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
var file_name = "./experiments_files/Experiment-" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate() + "-" + now.getHours() + ":" + now.getMinutes() + ".csmx";
console.log("Fichier de mesure enregistré sous : " + file_name);
fs.writeFileSync(file_name, "Mesure\n", 'UTF-8'); 

// Initialisation du module de récupération des données sur le port Serial
var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
var port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600
});
const parser = port.pipe(new Readline({ delimiter: '\r\n' })); // Code afin d'obtenir les messages en clair et non le buffer

// Evenement : port ouvert
port.on('open', function() {
    console.log('Serial Port Opened'); // Information console de l'ouverture du port

    // Récupération des données disponibles et écriture à la fin du fichier
    parser.on('data', function(data) {
        console.log(data);
        fs.appendFileSync(file_name, data); // Ajout de la ligne de mesure récupérée à la fin du fichier
        fs.appendFileSync(file_name, '\n');
    });

    setInterval(function() {
        port.write(Buffer.from('GO', 'utf-8'), function(err) {
            if (err) {
              return console.log('Error on write: ', err.message);
            }
            console.log('message written');
        });
    }, 2500);
    
});

// Gestion des erreurs
port.on('error', function(err) {
    console.log('Error: ', err.message);
});