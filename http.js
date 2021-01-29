var http = require('http');
var fs = require('fs');

server = http.createServer()

server.on("request", function (req, res) {
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    res.writeHead(200, {'Content-Type': 'image/png'});
    fs.createReadStream('./img.png').pipe(res);
    res.end("Hello World/n");
});

server.listen(3000)