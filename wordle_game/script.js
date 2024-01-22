// DOM elements
const rows = document.querySelectorAll(".grid-row");

// read word list
fetch("./word-list.txt")
  .then(function (res) {
    return res.text();
  })
  .then(function (data) {
    gameList.push(data.split("\n"));
    getWord();
  });

// helpers
let regex = /^[a-zA-Z]+$/;

// game state
const guesses = [[], [], [], [], [], []];
let gameWord = [];
let gameList = [];

let currGuess = [];
let currRow = 1;
let currCell = 1;

let cells = rows[currRow - 1].getElementsByClassName("box-letter");

// functions
function compareGuessToWord() {
  for (let i = 0; i < 5; i++) {
    if (currGuess[i] === gameWord[i]) {
      cells[i].parentElement.classList.add("in-place");
      guesses[currRow - 1][i] = 2;
    } else if (gameWord.includes(currGuess[i])) {
      cells[i].parentElement.classList.add("in-word");
      guesses[currRow - 1][i] = 1;
    } else {
      cells[i].parentElement.classList.add("not-in-word");
      guesses[currRow - 1][i] = 0;
    }
  }

  if (checkCorrect()) {
    console.log("you won!");
  } else {
    goToNextRow();
  }
}

function checkCorrect() {
  let correct = true;

  for (let i = 0; i < 5; i++) {
    if (!cells[i].parentElement.classList.contains("in-place")) {
      correct = false;
      break;
    }
  }

  return correct;
}

function goToNextRow() {
  if (currRow < 6) {
    currRow++;
    currCell = 1;
    currGuess = [];
    cells = rows[currRow - 1].getElementsByClassName("box-letter");
  } else {
    console.log("game over");
    console.log(gameWord.join(""));
  }
}

function checkWordList() {
  let correct = gameList[0].includes(currGuess.join(""));
  if (!correct) {
    console.log("wrong");
    rowShake();
  }

  return correct;
}

function rowShake() {
  let rep = 0;
  let counter = 90;
  rows[currRow - 1].classList.toggle("shake-left");

  let shakeFunc = function () {
    clearInterval(interval);
    counter -= 10;
    rep++;

    rows[currRow - 1].classList.toggle("shake-left");
    rows[currRow - 1].classList.toggle("shake-right");

    if (rep === 6) {
      rows[currRow - 1].classList.remove("shake-left");
      rows[currRow - 1].classList.remove("shake-right");
      clearInterval(interval);
    } else {
      interval = setInterval(shakeFunc, counter);
    }
  };

  let interval = setInterval(shakeFunc, counter);
}

function getWord() {
  let i = Math.floor(Math.random() * gameList[0].length);

  gameWord = gameList[0][i].split("");
  console.log(gameWord);
}

// event listeners
window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (regex.test(key) && key.length === 1 && currCell <= 5) {
    if (cells[currCell - 1].innerHTML === "") {
      cells[currCell - 1].innerHTML = key;
      currGuess.push(key);
      currCell++;
    }
  }

  if ((key === "backspace" || key === "delete") && currCell !== 1) {
    currCell--;
    currGuess.pop();
    cells[currCell - 1].innerHTML = "";
  }

  if (key === "enter" && currCell === 6) {
    if (checkWordList()) {
      console.log("lets go");
      compareGuessToWord();
    }
  }
});
