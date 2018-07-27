/*
Fichier "com-test.js"
Fusion de 'arduino.js' et 'server.js' afin de tester la commnication entre logiciel, serveur et arduino

Dernière modification par Lounès le 26/07
*/

const ansi = require("ansi-colors");
const http = require('http');
const url = require("url");
const fs = require("fs");

// Création du serveur HTTP et envoi de la page lors de la requête
server = http.createServer(function (req, res) {
    var page = req.url; // La page correspond à l'URL demandée (sans le nom de l'hôte)
    
    if(page==="/") page = "/index.html"; // Si on se connecte à la racine, alors remplacer la page par /index.html
    console.log(ansi.yellow(`A user is connected at ${page}`));
    
    var filePath = __dirname+"/pages"+page; // Trouver le fichier correspond à la page demandée
    
    var fileExists = fs.existsSync(filePath); // Verifier si le fichier existe
    
    if(!fileExists){ // Si le fichier n'existe pas
        console.log(ansi.red("404 at "+ page));
        
        // Redirection 404
        // let filePath = __dirname+"/pages/404.html";
        
        fs.readFile(filePath, function (err, resp) {
            // Erreur 404
            res.writeHead(404, {"Content-Type": "text/html"});
            res.write("Erreur 404");
            res.end();
        });
        
        return false;
    };
    
    var filePath = __dirname+"/pages"+page;
    
    try {
        fs.readFile(filePath, function (err, resp) {
            if(resp===null){
                res.writeHead(404);
                res.end();
                console.log(`Error at ${page} <br/>${err}`);
            }
            
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(resp);
            res.end();
        });
    } catch (error) {
        console.error(ansi.bgRed("CATCHED ERROR !!!")+" fs.readFile(filePath...)");
        console.error(ansi.red.strikethrough(error));
        console.log("");
    }
    
});

// Démarrage du Serveur
var port = 8080, adresse = "0.0.0.0"; // L'adresse 0.0.0.0 écoute toutes les IPs (locales et externes)
server.listen(port, adresse, function(){
    console.log(ansi.green("The server is serving. Waiter is waiting for a request."));
});

// Création des sockets
var io = require('socket.io').listen(server);
console.log('Serveur créé !');

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');

    var config_GPS = 0;
    var config_BAROMETRE = 0;
    var config_THERMOMETRE = 0;
    var config_START = 0;
    var config_END = 0;

    socket.on('startConfig', function() {
        console.log('Configuration lancée :');
        socket.on('configObject', function(message) {
            var configObject = JSON.parse(message);

            config_GPS = configObject.GPS;
            config_BAROMETRE = configObject.BAROMETRE;
            config_THERMOMETRE = configObject.THERMOMETRE;
            config_START = configObject.START;
            config_END = configObject.END;

            console.log('GPS : ' + config_GPS);
            console.log('BAROMETRE : ' + config_BAROMETRE);
            console.log('THERMOMETRE : ' + config_THERMOMETRE);
            console.log('START : ' + config_START);
            console.log('END : ' + config_END);
        });

        socket.on('stopConfig', function() {
            startConfig(config_GPS, config_BAROMETRE, config_THERMOMETRE, 0, config_START, config_END);
        });
    });

});


// Message de lancement
console.log("Lancé ! Récupération des données en cours...");

// Module de création et d'écriture dans un fichier et gestion de la date
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

            /* Décommenter après avoir fini les tests
            fs.appendFileSync(file_name, data); // Ajout de la ligne de mesure récupérée à la fin du fichier
            fs.appendFileSync(file_name, '\n'); // Retour à la ligne
            */
        }); 

    }, 5000);

});

// Gestion des erreurs
port.on('error', function(err) {
    console.log('Error: ', err.message);
});

function startConfig(GPS, bar, therm, clock, start, end) {

    // 0b00001111 ==> Config binary signal
    var stringMessage = "00001111" + toBinary(GPS, 'GPS') + toBinary(bar, 'bar') + toBinary(therm, 'therm') + /*toBinary(clock, 'clock') +*/ toBinary(start, 'start') + toBinary(end, 'end');

    var bufferArray = stringMessage.match(/.{1,8}/g); // Retourne un Array de String tous les 8 caractères (expression reguliere)

    bufferArray = bufferArray.map(function(str){ // Pour chaque élément de l'array...
        return parseInt(str, 2); // parseInt(str, base) ==> Transforme un string en int selon la base donnée (par défaut : base 10)
    });
    var buffer = Buffer.from(bufferArray); // Créé un Buffer à partir de l'array (nécessaire pour port.write)

    port.write(buffer, function(err) {
        if (err) {
          return console.log('Error on write config message: ', err.message);
        }
        console.log('');
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
}


