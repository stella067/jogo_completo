let score = 0;
let correctAnswers = 0;
let round = 1;
let gameOver = false;
let currTiles = [];
let intervalId;
let usedIndexes = [];
const maxScore = 100;
let audio;

const palavrasRound1 = [
  ["Pichar", "Pixar"], ["Chão", "Xão"], ["Mexer", "Mecher"], 
  ["Chique", "Xique"], ["Xícara", "Chícara"]
];

const palavrasRound2 = [
  ["Cansaço", "Cançaso"], ["Licença", "Licensa"], ["Assunto", "Acunto"],
  ["Passo", "Paço"], ["Pressa", "Preça"]
];

const palavrasRound3 = [
  ["Gelo", "Jelo"], ["Bege", "Beje"], ["Girar", "Jirar"],
  ["Viagem", "Viajem"], ["Geada", "Jeada"]
];

function getPalavras() {
  if (round === 1) return palavrasRound1;
  if (round === 2) return palavrasRound2;
  if (round === 3) return palavrasRound3;
  return [];
}

window.onload = function() {
  setGame();
  setupPlayButton();
  createInstructionBoard(); // Cria a placa de instruções
  updateInstructionBoard(); // Atualiza o texto da placa com base na rodada
}

function createInstructionBoard() {
  const instructionBoard = document.createElement("div");
  instructionBoard.id = "instructionBoard";
  instructionBoard.style.position = "absolute";
  instructionBoard.style.right = "20px";
  instructionBoard.style.top = "300px"; // Mover a placa mais para baixo
  instructionBoard.style.width = "200px";
  instructionBoard.style.padding = "15px";
  instructionBoard.style.backgroundColor = "#4CAF50"; // Ajuste para verde
  instructionBoard.style.border = "2px solid #ccc";
  instructionBoard.style.borderRadius = "10px";
  instructionBoard.style.fontSize = "16px";
  instructionBoard.style.color = "#000";
  document.body.appendChild(instructionBoard);
  instructionBoard.style.backgroundColor = "#4CAF50 !important";

}


function updateInstructionBoard() {
  const instructionBoard = document.getElementById("instructionBoard");
  if (round === 1) {
    instructionBoard.innerText = "Aperte nas palavras escritas corretamente com 'ch' ou 'x'.";
  } else if (round === 2) {
    instructionBoard.innerText = "Aperte nas palavras escritas corretamente com 'ss' ou 'ç'.";
  } else if (round === 3) {
    instructionBoard.innerText = "Aperte nas palavras escritas corretamente com 'g' ou 'j'.";
  }
}

function setGame() {
  const board = document.getElementById("board");
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.className = "tile";
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    
    let wordContainer = document.createElement("div");
    wordContainer.className = "word-container";
    tile.appendChild(wordContainer);
    
    board.appendChild(tile);
  }
  setWords();
  intervalId = setInterval(setWords, 4000);
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function setWords() {
  if (gameOver) {
    return;
  }

  currTiles.forEach(tile => {
    let wordContainer = tile.querySelector(".word-container");
    if (wordContainer) {
      wordContainer.innerHTML = "";
    }
    tile.removeEventListener("click", selectTile);
  });
  currTiles = [];

  const palavras = getPalavras();
  if (usedIndexes.length === palavras.length) {
    usedIndexes = [];
  }

  let index;
  do {
    index = getRandomIndex(palavras.length);
  } while (usedIndexes.includes(index));
  
  usedIndexes.push(index);

  let [correta, incorreta] = palavras[index];
  let corretaIndex = getRandomIndex(9).toString();
  let incorretaIndex;
  do {
    incorretaIndex = getRandomIndex(9).toString();
  } while (incorretaIndex === corretaIndex);

  let divCorreta = document.createElement("div");
  divCorreta.className = "palavra-correta";
  divCorreta.textContent = correta;
  let tileCorreta = document.getElementById(corretaIndex);
  let wordContainerCorreta = tileCorreta.querySelector(".word-container");
  wordContainerCorreta.appendChild(divCorreta);
  currTiles.push(tileCorreta);
  tileCorreta.addEventListener("click", selectTile);

  let divIncorreta = document.createElement("div");
  divIncorreta.className = "palavra-incorreta";
  divIncorreta.textContent = incorreta;
  let tileIncorreta = document.getElementById(incorretaIndex);
  let wordContainerIncorreta = tileIncorreta.querySelector(".word-container");
  wordContainerIncorreta.appendChild(divIncorreta);
  currTiles.push(tileIncorreta);
  tileIncorreta.addEventListener("click", selectTile);
}

function selectTile() {
  if (gameOver) return;
  this.removeEventListener("click", selectTile);

  if (this.querySelector(".palavra-correta")) {
    score += 10;
    correctAnswers += 1;
    document.getElementById("score").innerText = score.toString();

    if (correctAnswers >= 5) {
      nextRound();
    } else if (score >= maxScore) {
      showNextPhaseButton();
      clearInterval(intervalId);
      audio.pause();
    }
  } else {
    document.getElementById("score").innerText = "FIM DE JOGO: " + score.toString();
    gameOver = true;
    clearInterval(intervalId);
    audio.pause();
    currTiles.forEach(tile => {
      tile.removeEventListener("click", selectTile);
    });
  }
}

function nextRound() {
  correctAnswers = 0;
  round += 1;

  if (round > 3) {
    showNextPhaseButton();
    clearInterval(intervalId);
    audio.pause();
    gameOver = true;
  } else {
    usedIndexes = [];
    setGame();
    updateInstructionBoard(); // Atualizar a placa de instruções para a nova rodada
  }
}

function resetGame() {
  score = 0;
  correctAnswers = 0;
  round = 1;
  gameOver = false;
  document.getElementById("score").innerText = score.toString();
  hideNextPhaseButton();
  usedIndexes = [];
  setGame();
  updateInstructionBoard(); // Atualizar a placa de instruções ao resetar
}

function setupPlayButton() {
  let playButton = document.createElement("button");
  playButton.innerText = "Iniciar Música";
  playButton.addEventListener("click", playMusic);
  playButton.style.position = "absolute";
  playButton.style.top = "40px";
  playButton.style.left = "5px";
  playButton.style.fontSize = "18px";
  playButton.style.padding = "10px 20px";
  document.body.appendChild(playButton);
  playButton.style.backgroundColor = "#C8A2C8"
}

function playMusic() {
  audio = new Audio('allow-win-161689.mp3');
  audio.loop = true;
  audio.play().then(() => {
    console.log('Música iniciada com sucesso.');
  }).catch(error => {
    console.error('Erro ao reproduzir música:', error);
  });
}

function showNextPhaseButton() {
  let nextPhaseButton = document.createElement("button");
  nextPhaseButton.id = "nextPhaseButton";
  nextPhaseButton.innerText = "Próxima Fase";
  nextPhaseButton.style.backgroundColor = "#C8A2C8";
  nextPhaseButton.style.color = "#C8A2C8";
  nextPhaseButton.style.padding = "20px 40px";
  nextPhaseButton.style.borderRadius = "8px";
  nextPhaseButton.style.position = "absolute";
  nextPhaseButton.style.top = "10px";
  nextPhaseButton.style.left = "10px";
  nextPhaseButton.addEventListener("click", goToNextPhase);
  document.body.appendChild(nextPhaseButton);
}

function hideNextPhaseButton() {
  let nextPhaseButton = document.getElementById("nextPhaseButton");
  if (nextPhaseButton) {
    nextPhaseButton.remove();
  }
}
function createInstructionBoard() {
  const instructionBoard = document.createElement("div");
  instructionBoard.id = "instructionBoard";
  instructionBoard.style.position = "absolute";
  instructionBoard.style.right = "20px";
  instructionBoard.style.top = "300px"; // Mover a placa mais para baixo
  instructionBoard.style.width = "200px";
  instructionBoard.style.padding = "15px";
  instructionBoard.style.backgroundColor = "#f8f9fa";
  instructionBoard.style.border = "2px solid #ccc";
  instructionBoard.style.borderRadius = "10px";
  instructionBoard.style.fontSize = "16px";
  instructionBoard.style.color = "#000";
  document.body.appendChild(instructionBoard);
}
function setGame() {
  const board = document.getElementById("board");
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.className = "tile";
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    
    let wordContainer = document.createElement("div");
    wordContainer.className = "word-container";
    tile.appendChild(wordContainer);
    
    board.appendChild(tile);
  }
  setWords();
  intervalId = setInterval(setWords, 4000); // Definido para 4 segundos entre as trocas de palavras
}
window.onload = function() {
  createInstructionBoard();
  setupButtons(); // Configura os botões Revisão e Iniciar Jogo
  updateInstructionBoard();
}

window.onload = function() {
  createInstructionBoard();
  setupButtons(); // Configura os botões Revisão e Iniciar Jogo no canto esquerdo
  updateInstructionBoard();
}

function setupButtons() {
  // Botão de Revisão
  let reviewButton = document.createElement("button");
  reviewButton.innerText = "Revisão";
  reviewButton.addEventListener("click", reviewGame);
  reviewButton.style.position = "absolute";
  reviewButton.style.bottom = "20px";
  reviewButton.style.left = "20px";
  reviewButton.style.padding = "10px 20px";
  reviewButton.style.fontSize = "18px";
  reviewButton.style.backgroundColor = "#C8A2C8";
  reviewButton.style.borderRadius = "8px";
  document.body.appendChild(reviewButton);

  // Botão de Iniciar Jogo
  let startButton = document.createElement("button");
  startButton.innerText = "Iniciar Jogo";
  startButton.addEventListener("click", startGame);
  startButton.style.position = "absolute";
  startButton.style.bottom = "20px";
  startButton.style.left = "140px"; // Posição para que fique ao lado do botão de Revisão
  startButton.style.padding = "10px 20px";
  startButton.style.fontSize = "18px";
  startButton.style.backgroundColor = "#4CAF50";
  startButton.style.color = "#FFF";
  startButton.style.borderRadius = "8px";
  document.body.appendChild(startButton);
}
function reviewGame() {
  window.location.href = "revisao1.html";
}


function startGame() {
  setGame();
  setupPlayButton(); // Configura o botão de música
  intervalId = setInterval(setWords, 2000); // Começa a troca de palavras a cada 4 segundos
}
