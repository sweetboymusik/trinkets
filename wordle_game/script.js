// DOM elements
const rows = document.querySelectorAll(".grid-row");
const warning = document.querySelector(".warning");
const keys = document.querySelectorAll(".key");
const overlay = document.querySelector(".overlay");

// load word lists once
fetch("./word-list.txt")
  .then(function (res) {
    return res.text();
  })
  .then(function (data) {
    gameList.push(data.split("\n"));
    getWord();
  });

fetch("./word-guess-list.txt")
  .then(function (res) {
    return res.text();
  })
  .then(function (data) {
    guessList.push(data.split("\n"));
  });

let gameList = [];
let guessList = [];

// helpers
let regex = /^[a-zA-Z]+$/;

// game state
const guesses = [[], [], [], [], [], []];
let gameWord = [];

let currGuess = [];
let currKeys = [];
let currRow = 1;
let currCell = 1;
let warningOnScreen = false;
let warningTimer = false;
let canEnter = true;

let cells = rows[currRow - 1].getElementsByClassName("box-letter");

// functions
function compareGuessToWord() {
  let i = 0;

  if (currGuess[i] === gameWord[i]) {
    cells[i].parentElement.classList.add("in-place");
    currKeys[i].classList.add("key-in-place");
    guesses[currRow - 1][i] = 2;
  } else if (gameWord.includes(currGuess[i])) {
    cells[i].parentElement.classList.add("in-word");
    currKeys[i].classList.add("key-in-word");
    guesses[currRow - 1][i] = 1;
  } else {
    cells[i].parentElement.classList.add("not-in-word");
    currKeys[i].classList.add("key-not-in-word");

    guesses[currRow - 1][i] = 0;
  }

  i++;

  let guessInterval = setInterval(() => {
    if (i < 5) {
      if (currGuess[i] === gameWord[i]) {
        cells[i].parentElement.classList.add("in-place");
        currKeys[i].classList.add("key-in-place");
        guesses[currRow - 1][i] = 2;
      } else if (gameWord.includes(currGuess[i])) {
        cells[i].parentElement.classList.add("in-word");
        currKeys[i].classList.add("key-in-word");
        guesses[currRow - 1][i] = 1;
      } else {
        cells[i].parentElement.classList.add("not-in-word");
        currKeys[i].classList.add("key-not-in-word");

        guesses[currRow - 1][i] = 0;
      }
    } else {
      clearInterval(guessInterval);

      if (checkCorrect()) {
        winRound();
      } else {
        goToNextRow();
      }
    }

    i++;
  }, 300);
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
    currKeys = [];
    canEnter = true;
    cells = rows[currRow - 1].getElementsByClassName("box-letter");
  } else {
    gameOver(false);
  }
}

function checkWordList() {
  let correct =
    gameList[0].includes(currGuess.join("")) ||
    guessList[0].includes(currGuess.join(""));

  if (!correct) {
    rowShake();
  }

  return correct;
}

function rowShake() {
  let rep = 0;
  let counter = 90;

  rows[currRow - 1].classList.toggle("shake-left");
  displayWarning("not in word list");

  let shakeFunc = function () {
    clearInterval(interval);
    rep++;
    counter -= 10;

    rows[currRow - 1].classList.toggle("shake-left");
    rows[currRow - 1].classList.toggle("shake-right");

    if (rep === 7) {
      rows[currRow - 1].classList.remove("shake-left");
      rows[currRow - 1].classList.remove("shake-right");
      canEnter = true;
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

function displayWarning(str) {
  if (!warningOnScreen) {
    warning.innerHTML = str;
    warning.style.visibility = "visible";
    warning.classList.add("on-screen");
    warningOnScreen = true;
  }

  if (warningOnScreen && !warningTimer) {
    warningTimer = true;
    let timer = setTimeout(() => {
      warning.classList.remove("on-screen");
      warning.style.visibility = "hidden";
      warningOnScreen = false;
      warningTimer = false;
    }, 1000);
  }
}

function inputEvents(event) {
  const key = event;
  let keyboardKey;

  keys.forEach((k) => {
    if (
      k.childNodes[0].innerHTML === key &&
      k.childNodes[0].innerHTML.length === 1
    ) {
      keyboardKey = k;
    }
  });

  if (regex.test(key) && key.length === 1 && currCell <= 5) {
    if (cells[currCell - 1].innerHTML === "") {
      cells[currCell - 1].innerHTML = key;
      cells[currCell - 1].parentElement.classList.add("entered");
      currGuess.push(key);
      currKeys.push(keyboardKey);
      currCell++;
    }
  }

  if ((key === "backspace" || key === "delete") && currCell !== 1) {
    currCell--;
    currGuess.pop();
    currKeys.pop();
    cells[currCell - 1].innerHTML = "";
    cells[currCell - 1].parentElement.classList.remove("entered");
  }

  if (key === "enter" && currCell === 6 && canEnter) {
    canEnter = false;

    if (checkWordList()) {
      compareGuessToWord();
    }
  }
}

function winRound() {
  const delay = 120;
  let i = 0;
  let j = 0;
  let reps = 0;

  let bounceInterval = setInterval(() => {
    cells[i].parentElement.classList.add("bounce");
    cells[i].parentElement.classList.remove("bounce2");
    i === 4 ? (i = 0) : i++;
  }, delay);

  setTimeout(() => {
    let bounceStop = setInterval(() => {
      cells[j].parentElement.classList.add("bounce2");
      cells[i].parentElement.classList.remove("bounce");

      j === 4 ? (reps += 1) : (reps = reps);
      j === 4 ? (j = 0) : j++;

      if (reps === 4) {
        gameOver(true);
      }
    }, delay);
  }, 300);
}

function gameOver(win) {
  if (win) {
    overlay.classList.add("overlay-open");
    overlay.children[0].innerHTML = "you won";
  } else {
    overlay.classList.add("overlay-open");
    overlay.children[0].innerHTML = `the word was ${gameWord.join(
      ""
    )}<br> <br>try again `;
  }

  overlay.children[2].addEventListener("click", () => {
    overlay.classList.remove("overlay-open");

    setTimeout(() => {
      keyFlipOut();
      rowShuffleOut();
    }, 500);

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  });
}

// event listeners
window.addEventListener(
  "keydown",
  (e) => {
    inputEvents(e.key.toLowerCase());
  },
  false
);

keys.forEach((key) => {
  key.addEventListener("mousedown", () => {
    inputEvents(`${key.childNodes[0].innerHTML}`);
  });
}, false);

function rowShuffleOut() {
  for (let i = 0; i < 6; i++) {
    let direction = 0;
    (i + 1) % 2 === 0 ? (direction = 0) : (direction = 1);
    direction === 0
      ? rows[i].classList.add("slide-left")
      : rows[i].classList.add("slide-right");
  }
}

function rowShuffleIn() {
  j = 0;
  for (let i = 0; i < 6; i++) {
    let direction = 0;
    (i + 1) % 2 === 0 ? (direction = 0) : (direction = 1);
    direction === 0
      ? rows[i].classList.add("slide-right")
      : rows[i].classList.add("slide-left");
  }

  setTimeout(() => {
    for (let i = 0; i < 6; i++) {
      let direction = 0;
      rows[i].classList.remove("slide-left");
      rows[i].classList.remove("slide-right");
      j++;
    }
  }, 300);
}

function keyFlipOut() {
  let p = 0;

  let intervalFlip = setInterval(() => {
    if (p < 28) {
      keys[p].style.transition = "all 0.05s ease-in-out;";

      if (keys[p].classList.length > 1) {
        keys[p].classList.add("key-flip-two");
      } else {
        keys[p].classList.add("key-flip");
      }
    } else {
      clearInterval(intervalFlip);
    }

    p++;
  }, 20);
}

function keyFlipIn() {
  let p = 0;

  keys.forEach((key) => {
    if (keys[p].classList.length > 1) {
      keys[p].classList.add("key-flip-two");
    } else {
      keys[p].classList.add("key-flip");
    }
  });

  setTimeout(() => {
    let intervalFlip = setInterval(() => {
      console.log(p);
      if (p < 28) {
        keys[p].style.transition = "all 0.05s ease-in-out;";

        if (keys[p].classList.length > 1) {
          keys[p].classList.remove("key-flip-two");
        } else {
          keys[p].classList.remove("key-flip");
        }
      } else {
        clearInterval(intervalFlip);
      }

      p++;
    }, 20);
  }, 300);
}

rowShuffleIn();
// keyFlipIn();
