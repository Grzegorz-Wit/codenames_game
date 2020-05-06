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

keysArray = shuffle(keysArray);
wordsArray = chooseWordsForCurrentGame();

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
        wordsArray = chooseWordsForCurrentGame();
        flippedCards = [];
        socket.broadcast.emit('words for game', (wordsArray));
        socket.broadcast.emit('ng');
    });

    socket.on('join game', (data) => {
        socket.emit('words for game', (wordsArray));
    });


    socket.on('joined', (nickname) => {
        console.log(nickname)
        socket.broadcast.emit('user joined', (nickname));
    });

    socket.on('show keys', function() {
        socket.emit('keys table', (keysArray));
    });    

    socket.on('uncovered keys', function() {
        // socket.broadcast
    })
});




