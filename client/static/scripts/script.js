

const socket = io();

var player = 'red';
var otherPlayer = 'blue';

function queryCardData(self) {
  socket.emit('card', self.id);
  self.removeEventListener('click', function() {queryCardData(card)});
}

let overlay = document.getElementById('startText')

function joinGame() {
    overlay.classList.remove('visible');
    socket.emit('join game', function() {cardsArray.forEach(card => card.setAttribute('class', 'card'))});
    // var nickname = document.getElementById('nickname').value;
    // socket.emit('joined', (nickname));

    // document.getElementById('chat').innerHTML = (nickname + 'dołączył');

};


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
  var cells = Array.from(document.getElementsByTagName('td'));
  cells.forEach(cell => {
    cell.setAttribute('class', '')
  });
  document.getElementById('output').innerHTML = ('red team guessing').fontcolor('red');
});


socket.on('words for game', words => {
  var allCardsArray = Array.from(document.getElementsByClassName('text-on-card'));
  var i = 0;
  allCardsArray.forEach(card => {
  card.innerHTML = words[i];
  i++;
})});

var cells = Array.from(document.getElementsByTagName('td'));


socket.on('keys table', keys => {
  var cells = Array.from(document.getElementsByTagName('td'));
  cells.forEach(cell => {
    cell.setAttribute('class', keys[cell.id-1])
    socket.emit('uncovered keys');
  })
  });


var allCardsArray = Array.from(document.getElementsByClassName('text-on-card'));

function showKeys() {
  socket.emit('show keys', function() {})
}


const name = prompt('Podaj swój nick')
socket.emit('new-user', name)

const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')


messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage('Ty: ' + message)
  socket.emit('send-chat-message', message)
  messageInput.value = ''
})

socket.on('user-connected', name => {
  appendMessage(name + ' dołączył/a')
})

socket.on('user disconnected', name => {
  appendMessage(name + ' rozłączył/a się')
})

socket.on('chat-message', data => {
  appendMessage(data.name + ': ' + data.message)
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

appendMessage('Dołączyłeś do gry')
