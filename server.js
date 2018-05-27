    
const http = require('http');
const url = require("url");
const fs = require("fs");

server = http.createServer(function (req, res) {
    var page = req.url;
    
    if(page==="/") page = "/index.html";
    console.log(`A user is connected at ${page}`);
    
    var filePath = __dirname+"/pages"+page;
    
    var fileExists = fs.existsSync(filePath);
    
    if(!fileExists){
        console.log("404 at "+ page);
        
        let filePath = __dirname+"/pages/404.html";
        
        fs.readFile(filePath, function (err, resp) {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.write(resp);
            res.end();
        });
        
        return false;
    };
    
    var filePath = __dirname+"/pages"+page;
    
    fs.readFile(filePath, function (err, resp) {
        if(resp===null){
            res.writeHead(404);
            res.end();
            console.log(`Error at ${page} <br/>${err}`);
        }
        
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(resp);
        res.end();
    })
    
});


server.listen(8080, "41.213.190.93", function(){
    console.log("The server is serving. Waiter is waiting for a request.");
});