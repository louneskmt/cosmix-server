const ansi = require("ansi-colors");
const http = require('http');
const url = require("url");
const fs = require("fs");

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

var io = require('socket.io').listen(server);
console.log('Serveur créé !');

server.listen(8080);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
});

