var express = require('express'),
	http = require('http');

var app = express();

// Logging
app.use(function(req, res, next){
	console.log('%s %s', req.method, req.url);
	next();
});

// Site Directory
app.use(express.static('public'));


app.use(function(req, res){
	res.sendFile(__dirname + '/public');
})

// Create Server
var server = http.createServer(app);
server.listen(5000);


var io = require('socket.io').listen(server);

var sockets = require("./sockets");
sockets.init(server, io);

