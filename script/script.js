const API = "https://opentdb.com/api.php?amount=50";
const TEN_SECONDS = 10 * 1000;
const ONE_SECOND = 1000;
let state;

window.onload = async function () {
    start();
}

async function factoryQuiz() {
    const { results } = await getQuestions();
    return {
        player: {
            score: "0"
        },
        questions: results,
        questionActual: null,
        questionsCorrect:0,
        time: {
            intervalReference: null,
            seconds: 10,
            intervalReferenceSeconds: null,
            allTime: 0
        },
        finished: false
    }
}

async function start() {
    state = await factoryQuiz();
    callBack();
    state.time.intervalReference = setInterval(callBack, TEN_SECONDS);
}

function getQuestions() {
    return fetch(API).then((response) => response.json())
        .catch((error) => console.log(`Houve um erro. \n ${error}`))
}

function callBack() {
    clearInterval(state.time.intervalReferenceSeconds);

    let question = state.questions.pop();
    state.time.seconds = 10;

    if (!question) {
        clearInterval(state.time.intervalReference);
    } else {
        let $timer = document.getElementById("timer");
        $timer.innerHTML = state.time.seconds;

        mountQuestion(question);
        state.questionActual = question;

        state.time.intervalReferenceSeconds = setInterval(() => {
            state.time.seconds--;
            state.time.allTime++;

            $timer.innerHTML = `${state.time.seconds}`;
            console.log(state.time.seconds);

            if (state.time.seconds <= 1) {
                clearInterval(state.time.intervalReferenceSeconds);
                clearInterval(state.time.intervalReference);
                setTimeout(finishQuiz, ONE_SECOND);
            }
        }, ONE_SECOND);
    }
}

function mountQuestion({ category, difficulty, question, incorrect_answers, correct_answer }) {
    console.log(correct_answer);

    let $question = document.querySelector(".container-answer header p");
    let $list = document.querySelector(".container-answer ul.answers");

    let $difficulty = document.querySelector("#difficulty");
    let $category = document.querySelector("#category");

    const answers = shuffle([correct_answer, ...incorrect_answers]);

    let template = "";

    answers.map((answer) => {
        template += `
        <li>
            <button class="answer" onClick="handleClick(this)"> 
                ${answer}
            </button>
        </li>`
    });

    $difficulty.innerHTML = difficulty;
    $category.innerHTML = category;
    $question.innerHTML = question;
    $list.innerHTML = template;
}

function shuffle(oldArray) {
    var j, x, i;
    var newArray = oldArray;
    for (i = newArray.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = newArray[i];
        newArray[i] = newArray[j];
        newArray[j] = x;
    }
    return newArray;
}

function handleClick(elemento) {

    if (state.finished) {
        return;
    }

    let buttons = document.querySelectorAll(".answer");
    buttons.forEach((btn) => {
        btn.disabled = true;
    })

    const alternativa = elemento.innerText;

    if (answerIsCorrect(alternativa)) {
        elemento.classList.add('answer-correct');
        const seconds = Number(state.time.seconds);
        state.player.score = Number(state.player.score) + 10 + seconds;
        state.questionsCorrect++;
    } else {
        elemento.classList.add('answer-incorrect');
        state.finished = true;
    }

    clearInterval(state.time.intervalReferenceSeconds);
    clearInterval(state.time.intervalReference);

    setTimeout(resetQuiz, ONE_SECOND);
}

function resetQuiz() {
    if (!state.finished) {
        state.time.intervalReference = setInterval(callBack, TEN_SECONDS);
        callBack();
    } else {
        finishQuiz();
    }
}

function answerIsCorrect(alternativa) {
    return alternativa === state.questionActual.correct_answer;
}

function finishQuiz() {
    console.log("ACABO PARSA");
    console.log(state);

    const name = prompt("Qual o seu nome?") || "Desconhecido";
    console.log(name);

    const data = {
        name,
        score: state.player.score,
        allTime: state.time.allTime,
        questions: state.questionsCorrect
    }

    setItem(data);

    let $modal = document.querySelector(".container-modal");
    $modal.classList.add("container-modal-active");
}

function setItem(item) {
    let data = localStorage.getItem("ranking");

    if (!data) {
        data = [];
    } else {
        data = JSON.parse(data);
    }

    data.push(item);
    localStorage.setItem("ranking", JSON.stringify(data));
}

function navigateTo(url){
    const urlFull = `http://${window.location.host}/${url}`
    console.log(urlFull);
    window.location.replace(urlFull);
}

function restart(){
    let $modal = document.querySelector(".container-modal");
    $modal.classList.remove("container-modal-active");

    start();
}