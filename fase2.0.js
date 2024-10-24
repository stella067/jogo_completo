// Selecionando todos os elementos necessários
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");

// Botão para passar de fase
const pass_btn = document.querySelector(".pass_btn");

// Quando o usuário acertar 10 perguntas
function checkPassPhase() {
    if (userScore === 10) {
        pass_btn.classList.add("show");
        pass_btn.addEventListener("click", passToNextPhase);
    }
}

// Lógica para passar para a próxima fase
function passToNextPhase() {
    window.location.href = "https://gabystella3.github.io/portifolio/";
}

// Se o botão startQuiz for clicado
start_btn.onclick = () => {
    info_box.classList.add("activeInfo");
};

// Se o botão exitQuiz for clicado
exit_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
};

// Se o botão continueQuiz for clicado
continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuetions(0);
    queCounter(1);
    startTimer(15);
    startTimerLine(0);
};

let timeValue = 15;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// Se o botão restartQuiz for clicado
restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz");
    result_box.classList.remove("activeResult");
    timeValue = 15;
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuetions(que_count);
    queCounter(que_numb);
    clearInterval(counter);
    clearInterval(counterLine);
    startTimer(timeValue);
    startTimerLine(widthValue);
    timeText.textContent = "Tempo restante";
    next_btn.classList.remove("show");
    pass_btn.classList.remove("show");
};

// Se o botão quitQuiz for clicado
quit_quiz.onclick = () => {
    window.location.reload();
};

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// Se o botão Next Que for clicado
next_btn.onclick = () => {
    if (que_count < questions.length - 1) {
        que_count++;
        que_numb++;
        showQuetions(que_count);
        queCounter(que_numb);
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(timeValue);
        startTimerLine(widthValue);
        timeText.textContent = "Tempo restante";
        next_btn.classList.remove("show");
        pass_btn.classList.remove("show");
        checkPassPhase();
    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        showResult();
    }
};

// Pegando questões e opções do array
function showQuetions(index) {
    const que_text = document.querySelector(".que_text");
    let que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + "</span>";
    let option_tag =
        '<div class="option"><span>' + questions[index].options[0] + "</span></div>" +
        '<div class="option"><span>' + questions[index].options[1] + "</span></div>";
    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;

    const option = option_list.querySelectorAll(".option");

    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)");
    }
}

let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function optionSelected(answer) {
    clearInterval(counter);
    clearInterval(counterLine);
    let userAns = answer.textContent;
    let correcAns = questions[que_count].answer;
    const allOptions = option_list.children.length;

    if (userAns == correcAns) {
        userScore += 1;
        answer.classList.add("correct");
        answer.insertAdjacentHTML("beforeend", tickIconTag);
        console.log("Resposta correta");
        console.log("Suas respostas corretas = " + userScore);
    } else {
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIconTag);
        console.log("Resposta errada");

        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correcAns) {
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                console.log("Resposta correta selecionada automaticamente.");
            }
        }
    }
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
    }
    next_btn.classList.add("show");
    pass_btn.classList.remove("show");
    checkPassPhase();
}

function showResult() {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 3) {
        let scoreTag =
            '<span>Parabéns! , Você tem <p>' + userScore + "</p> de <p>" + questions.length + "</p></span>";
        scoreText.innerHTML = scoreTag;
    } else if (userScore > 1) {
        let scoreTag =
            '<span>Parabéns , Você tem <p>' + userScore + "</p> de <p>" + questions.length + "</p></span>";
        scoreText.innerHTML = scoreTag;
    } else {
        let scoreTag =
            '<span>Desculpe, você só tem <p>' + userScore + "</p> de <p>" + questions.length + "</p></span>";
        scoreText.innerHTML = scoreTag;
    }
    checkPassPhase();
}

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if (time < 0) {
            clearInterval(counter);
            timeText.textContent = "Tempo esgotado";
            const allOptions = option_list.children.length;
            let correcAns = questions[que_count].answer;
            for (let i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent == correcAns) {
                    option_list.children[i].setAttribute("class", "option correct");
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                    console.log("Tempo esgotado: resposta correta selecionada automaticamente.");
                }
            }
            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled");
            }
            next_btn.classList.add("show");
            pass_btn.classList.remove("show");
            checkPassPhase();
        }
    }
}

function startTimerLine(time) {
    counterLine = setInterval(timer, 29);
    function timer() {
        time += 1;
        time_line.style.width = time + "px";
        if (time > 549) {
            clearInterval(counterLine);
        }
    }
}

function queCounter(index) {
    let totalQueCounTag = '<span><p>' + index + "</p> de <p>" + questions.length + "</p> Questões</span>";
    bottom_ques_counter.innerHTML = totalQueCounTag;
}

// Inicialmente ocultar o botão de passar de fase
pass_btn.classList.remove("show");

// Verificar se o usuário acertou 10 perguntas sempre que uma opção é selecionada
function checkPassPhase() {
    if (userScore === 10) {
        pass_btn.classList.add("show");
    } else {
        pass_btn.classList.remove("show");
    }
}

function setupPlayButton() {
    let playButton = document.createElement("button");
    playButton.innerText = "Iniciar Música";
    playButton.addEventListener("click", playMusic);
    playButton.style.position = "absolute";
    playButton.style.top = "10px"; // Posição no topo
    playButton.style.left = "50%"; // Centralizando horizontalmente
    playButton.style.transform = "translateX(-50%)"; // Ajustando para centralizar
    playButton.style.fontSize = "18px"; // Tamanho da fonte maior
    playButton.style.padding = "15px 30px"; // Maior espaçamento interno
    playButton.style.borderRadius = "8px"; // Borda arredondada
    playButton.style.backgroundColor = "#3498db"; // Cor de fundo azul
    playButton.style.color = "#ffffff"; // Cor do texto branco
    document.body.appendChild(playButton);
}

function playMusic() {
    let audio = new Audio("1.mp3");
    audio.loop = true;
    audio.play();
    console.log("Música tocando");
}

setupPlayButton();