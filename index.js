var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});

// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
//   socket.on('chat message', function(msg){
//     console.log('message: ' + msg);
//   });
// });

var users = {}

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
  	console.log('NUEVO MENSAJE A '+ user)
  	console.log('MENSAJE '+msg)
  	socketDestino.emit('mensajeRecibido', msg);
  });
  
  socket.on('username', function(username){
  	console.log('NUEVO USER: ' + username);
  	users[username] = socket;
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});