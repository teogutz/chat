var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

var users = {}
var operadores = {}

io.on('connection', function(socket){

  socket.emit('connect');	
  
  socket.on('chatMessage', function(msg){
    console.log('message: ' + msg);
  });

  socket.on('chatMessage', function(msg){
    io.emit('chatMessage', msg);
  });
  
  socket.on('mensajeDirecto', function(user, msg){
  	var socketDestino = users[user];
  	console.log('NUEVO MENSAJE A '+ user);
  	console.log('MENSAJE '+msg);
  	socketDestino.emit('mensajeRecibido', msg);
  });
  
  socket.on('mensajeDeUsuario', function(mensaje){
  	socket.operador.emit('mensajeRecibido', mensaje);
  });
  
  socket.on('username', function(username){
  	console.log('NUEVO USER: ' + username);
  	socket.username = username;
  	users[username] = socket;
  	for (var operador in operadores) {
  		socket.operador = operadores[operador];
  		console.log('SE ASIGNO ' + operador + ' A ' + username);
  	}
  });
  
  socket.on('operador', function(username){
  	console.log('NUEVO OPERADOR: ' + username);
  	socket.username = username;
  	users[username] = socket;
  	operadores[username] = socket;
  });
  
  socket.on('disconnect', function(){
  	console.log("SE DESCONECTO: " + socket.username);
  	delete users[socket.username];
  	console.log("Hay " + Object.keys(users).length + " usuarios conectados:");
  	for (var key in users) {
  		console.log(key);
  	}
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});