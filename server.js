var express = require('express');
var app = express();
var serv = require('http').Server(app);
const PORT = process.env.PORT || 2000;


app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(PORT, () => console.log(`Listening on ${PORT}`));
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



function chooseWordsForCurrentGame() {
    var fs = require("fs");
    var words = fs.readFileSync("client/words.txt").toString();
    var wordsForCurrentGame = [];
    words = words.split(' ');
    var wordsFileShuffled = shuffle(words)
    for (var i = 0; i <25 ; i++) {
        wordsForCurrentGame.push(wordsFileShuffled[i])
    }
     return wordsForCurrentGame;
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

flippedCards = [];
var SOCKET_LIST = {};
const users = {}

keysArray = shuffle(keysArray);
wordsArray = chooseWordsForCurrentGame();

var io = require('socket.io')(serv,{});
io.on('connection', function(socket){
    // socket.id = Math.random();
    // SOCKET_LIST[socket.id] = socket;
    console.log('connected');


    flippedCards.forEach(data => {
        socket.emit('response', {team: keysArray[data-1], id: data});
    });


    socket.on('disconnect',function(){
        socket.broadcast.emit('user disconnected', users[socket.id])
        delete users[socket.id]
        delete SOCKET_LIST[socket.id];
        console.log('disconnected');
    });

    socket.on('card', (data) => {
        io.sockets.emit('response', {team: keysArray[data-1], id: data});
        flippedCards.push(data);
    });
    socket.on('new game', (data) => {
        console.log('new game');
        keysArray = shuffle(keysArray);
        wordsArray = chooseWordsForCurrentGame();
        flippedCards = [];
        io.sockets.emit('words for game', (wordsArray));
        io.sockets.emit('ng');
    });

    socket.on('join game', (data) => {
        socket.emit('words for game', (wordsArray));
    });

    socket.on('show keys', function() {
        socket.emit('keys table', (keysArray));
    });    


    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)
    })

    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id] })
    })
});




