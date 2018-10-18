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
console.log("Experiment file created at : " + file_name);
try{
    fs.writeFileSync(file_name, "Mesure\n", 'UTF-8'); 
}catch(error){
    console.log("Err 404 : "+file_name);
}

var binstring = require('binstring');

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

    setTimeout(function() {
        // Récupération des données disponibles et écriture à la fin du fichier de mesure
        parser.on('data', function(data) {
            console.log(data);

            fs.appendFileSync(file_name, data); // Ajout de la ligne de mesure récupérée à la fin du fichier
            fs.appendFileSync(file_name, '\n'); // Retour à la ligne

            
        }); 


        // TO CORRECT
        // Config signal
        /*port.write(15, function(err) {
            if (err) {
              return console.log('Error on write config signal: ', err.message);
            }
            console.log('Config signal written: \n');
        });*/

    }, 5000);

});

// Gestion des erreurs
port.on('error', function(err) {
    console.log('Error: ', err.message);
});

/*
function startConfig(GPS, bar, therm, clock, start, end) {

    // 0b00001111 ==> Config binary signal
    var stringMessage = "00001111"+ toBinary(GPS, 'GPS') + toBinary(bar, 'bar') + toBinary(therm, 'therm') + /*toBinary(clock, 'clock') + toBinary(start, 'start') + toBinary(end, 'end');

    var bufferArray = stringMessage.match(/.{1,8}/g); // Retourne un Array de String tous les 8 caractères (expression reguliere)

    bufferArray = bufferArray.map(function(str){ // Pour chaque élément de l'array...
        return parseInt(str, 2); // parseInt(str, base) ==> Transforme un string en int selon la base donnée (par défaut : base 10)
    });
    var buffer = Buffer.from(bufferArray); // Créé un Buffer à partir de l'array (nécessaire pour port.write)

    port.write(buffer, function(err) {
        if (err) {
          return console.log('Error on write config message: ', err.message);
        }
        console.log('Config message written from Buffer: ' + bufferArray + '\n');
    });
}

function toBinary(data, type) {
    var taille = 0;
    
    data = data.toString(2);

    switch(type) {
        case 'GPS':
        case 'bar':
        case 'therm':
        case 'start':
        case 'end':
            taille = 16;
            break;
        case 'clock':
            taille = 48;
    }

    // Ajout des 0 pour combler le vide
    while(data.length < taille) {
        data = '0' + data;
    }

    return data;
} */
