

const socket = io();

var player = 'red';
var otherPlayer = 'blue';

function queryCardData(self) {
  socket.emit('card', self.id);
  console.log(self.id);
  self.removeEventListener('click', function() {queryCardData(card)});
}

let overlays = Array.from(document.getElementsByClassName('overlay-text'));

overlays.forEach(overlay => {
  overlay.addEventListener('click', () => {
    overlay.classList.remove('visible');
    socket.emit('new game', function() {cardsArray.forEach(card => card.setAttribute('class', 'card'))});  });
});

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


socket.on('words for game', words => {
  console.log(words);
  var allCardsArray = Array.from(document.getElementsByClassName('text-on-card'));
  var i = 0;
  allCardsArray.forEach(card => {
  card.innerHTML = words[i];
  i++;
})});

socket.on('keys table', keys => {
  var cells = Array.from(document.getElementsByTagName('td'));
  cells.forEach(cell => {
    cell.setAttribute('class', keys[cell.id-1])
  })
  });


var allCardsArray = Array.from(document.getElementsByClassName('text-on-card'));



