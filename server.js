var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen();
console.log('server started')



function shuffle(a) {
var j, x, i;
for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
}
return a;
}
keysArray = [
    'blue',
    'blue',
    'blue',
    'blue',
    'blue',
    'blue',
    'blue',
    'blue',
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
    'red',
    'innocent',
    'innocent',
    'innocent',
    'innocent',
    'innocent',
    'innocent',
    'innocent',
    'assassin'
]

keysArray = shuffle(keysArray);
console.log(keysArray);
flippedCards = [];

var SOCKET_LIST = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    console.log('connected');
    flippedCards.forEach(data => {
        socket.emit('response', {team: keysArray[data-1], id: data});
    });


    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        console.log('disconnected');
    });

    socket.on('card', (data) => {
        socket.broadcast.emit('response', {team: keysArray[data-1], id: data});
        flippedCards.push(data);
    });
    socket.on('new game', (data) => {
        console.log('new game');
        keysArray = shuffle(keysArray);
        console.log(keysArray);
        flippedCards = [];
        socket.broadcast.emit('ng');
    });
});

