let score = 0;
let gameOver = false;
let currTiles = [];
let intervalId;
let usedIndexes = [];
const maxScore = 100; // Pontuação máxima para mostrar o botão de próxima fase

const palavras = [
    ["Exceção", "Excessão"], ["Mexer", "Mecher"], ["Cansaço", "Cançaço"], 
    ["Licença", "Licensa"], ["estender", "extender"], ["Chuchu", "Xuxu"], 
    ["Mexer", "Mecher"], ["xerife", "cherife"], ["Chique", "Xique"], 
    ["xícara", "chícara"]
];

window.onload = function() {
  setGame();
  setupPlayButton(); // Configurar botão para iniciar música
}

function setGame() {
  const board = document.getElementById("board");
  board.innerHTML = ''; // Limpar o tabuleiro
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.className = "tile";
    tile.id = i.toString();
    tile.addEventListener("click", selectTile);
    
    let wordContainer = document.createElement("div");
    wordContainer.className = "word-container";
    tile.appendChild(wordContainer); // Adicionar o container das palavras ao quadrado
    
    board.appendChild(tile);
  }
  setWords();
  intervalId = setInterval(setWords, 4000); // A cada 4 segundos
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function setWords() {
  if (gameOver) {
    return;
  }

  // Limpar quadrados anteriores
  currTiles.forEach(tile => {
    let wordContainer = tile.querySelector(".word-container");
    if (wordContainer) {
      wordContainer.innerHTML = "";
    }
    tile.removeEventListener("click", selectTile); // Remover evento de clique anterior
  });
  currTiles = [];

  // Verificar se todas as palavras foram usadas
  if (usedIndexes.length === palavras.length) {
    usedIndexes = [];
  }

  let index;
  do {
    index = getRandomIndex(palavras.length);
  } while (usedIndexes.includes(index));
  
  usedIndexes.push(index);

  let [correta, incorreta] = palavras[index];

  // Escolher aleatoriamente um quadrado para a palavra correta
  let corretaIndex = getRandomIndex(9).toString();

  // Escolher aleatoriamente outro quadrado para a palavra incorreta
  let incorretaIndex;
  do {
    incorretaIndex = getRandomIndex(9).toString();
  } while (incorretaIndex === corretaIndex);

  // Definir a palavra correta no quadrado correto
  let divCorreta = document.createElement("div");
  divCorreta.className = "palavra-correta";
  divCorreta.textContent = correta;
  let tileCorreta = document.getElementById(corretaIndex);
  let wordContainerCorreta = tileCorreta.querySelector(".word-container");
  wordContainerCorreta.appendChild(divCorreta);
  currTiles.push(tileCorreta);
  tileCorreta.addEventListener("click", selectTile); // Adicionar evento de clique

  // Definir a palavra incorreta no quadrado incorreto
  let divIncorreta = document.createElement("div");
  divIncorreta.className = "palavra-incorreta";
  divIncorreta.textContent = incorreta;
  let tileIncorreta = document.getElementById(incorretaIndex);
  let wordContainerIncorreta = tileIncorreta.querySelector(".word-container");
  wordContainerIncorreta.appendChild(divIncorreta);
  currTiles.push(tileIncorreta);
  tileIncorreta.addEventListener("click", selectTile); // Adicionar evento de clique
}

function selectTile() {
  if (gameOver) {
    return;
  }

  // Desabilitar o evento de clique para evitar múltiplas contagens
  this.removeEventListener("click", selectTile);

  // Verificar se o quadrado clicado contém a palavra correta
  if (this.querySelector(".palavra-correta")) {
    score += 10;
    document.getElementById("score").innerText = score.toString();
    if (score >= maxScore) {
      clearInterval(intervalId);
      audio.pause(); // Pausa a música quando o jogo é ganho
      window.location.href = "vitoria.html"; // Redireciona para a tela de vitória
    }
  } else {
    document.getElementById("score").innerText = "FIM DE JOGO: " + score.toString();
    gameOver = true;
    clearInterval(intervalId);
    audio.pause(); // Pausa a música quando o jogo termina
    // Remover eventos de clique restantes
    currTiles.forEach(tile => {
      tile.removeEventListener("click", selectTile);
    });
    setTimeout(() => {
      window.location.href = "derrota.html"; // Redireciona para a tela de derrota
    }, 2000); // Aguardar 2 segundos antes de redirecionar
  }
}

function resetGame() {
  score = 0;
  gameOver = false;
  document.getElementById("score").innerText = score.toString();
  hideNextPhaseButton();
  usedIndexes = [];
  setGame();
}

function setupPlayButton() {
  let playButton = document.createElement("button");
  playButton.innerText = "Iniciar Música";
  playButton.addEventListener("click", playMusic);
  playButton.style.position = "absolute";
  playButton.style.top = "40px"; // Posição no topo
  playButton.style.left = "5px"; // Posição à esquerda
  playButton.style.fontSize = "18px"; // Tamanho da fonte maior
  playButton.style.padding = "10px 20px"; // Maior espaçamento interno
  document.body.appendChild(playButton);
}

let audio; // Declarar a variável audio fora da função playMusic para ser acessível globalmente

function playMusic() {
  audio = new Audio('allow-win-161689.mp3');
  audio.loop = true;
  audio.play().then(() => {
    console.log('Música iniciada com sucesso.');
  }).catch(error => {
    console.error('Erro ao reproduzir música:', error);
  });
}

function hideNextPhaseButton() {
  let nextPhaseButton = document.getElementById("nextPhaseButton");
  if (nextPhaseButton) {
    nextPhaseButton.remove();
  }
}
