var http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var ent = require('ent');

var server = http.createServer(app);
var io = require('socket.io').listen(server);


app.use(express.static('images'));
app.get("/", function(req, res){
				res.sendFile(path.join(__dirname, 'index.html'));
});
app.all("/page1", function(req, res){
			res.sendFile(path.join(__dirname, 'page1.html'));
});

	io.sockets.on('connection', (socket) =>{
		console.log('Nouvelle connexion ');
		socket.on('message_chat', function(msg){
			msg = ent.encode(msg);
			console.log('Message received: '+msg);
			//io.emit('message_chat', {pseudo: socket.pseudo, message: msg});

			//On envoie le message a tout le monde sauf #nous
			socket.broadcast.emit('message_chat', {pseudo: socket.pseudo, message: msg});
		});
		socket.on('send_pseudo', function(pseudo){
			socket.pseudo = pseudo;
			socket.broadcast.emit('message_info', socket.pseudo+' vient de se connecter !');
		});
		socket.emit('message_info', 'Vous êtes bien connecté !');
		socket.on('disconnect', function(){
			console.log("Un utilisateur s'est deconnecté !");
			socket.broadcast.emit('message_info', socket.pseudo+ " s\'est deconnecté !" );
		})
	});

	let port = process.env.PORT  || 5000;
server.listen(port);
