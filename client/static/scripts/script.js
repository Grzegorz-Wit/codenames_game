

const socket = io();

var player = 'red';
var otherPlayer = 'blue';

function queryCardData(self) {
  socket.emit('card', self.id);
  console.log(self.id);
  self.removeEventListener('click', function() {queryCardData(card)});
}


cardsArray = document.querySelectorAll('div.card');
document.getElementById('output').innerHTML = (player + ' team guessing').fontcolor(player);
cardsArray.forEach(card => card.addEventListener('click', function() {queryCardData(card)}));

socket.on('response', (data) => {
  div = document.getElementById(data.id);
  div.setAttribute('class', 'card flipped');
  div.getElementsByClassName('front-face')[0].setAttribute('src', '/client/static/img/type-card.jpg'.replace(/type/, data.team))
  checkTeam = data.team;

  if (checkTeam !== player) {
    temp = player;
    player = otherPlayer;
    otherPlayer = temp;
    document.getElementById('output').innerHTML = (player + ' team guessing').fontcolor(player);
  }
});

function newGame() {
  socket.emit('new game', function() {cardsArray.forEach(card => card.setAttribute('class', 'card'))});
  
};

socket.on('ng', function() {
  cardsArray.forEach(card => card.setAttribute('class', 'card'))

});