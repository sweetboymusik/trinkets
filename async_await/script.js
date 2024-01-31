let wordEl = document.querySelector(".word");
let button = document.querySelector(".btn");
let numLetters = document.querySelector(".letters");
let titleEl = document.querySelector(".title");

const message = "Generate a random word...";

async function getWord() {
  console.log("fetching...");
  let value = numLetters.value;

  let word = await fetch(
    `https://random-word-api.herokuapp.com/word?length=${value}`
  ).then((response) => response.json());

  console.log(word);

  wordEl.innerHTML = word;
}

button.addEventListener("click", getWord);

async function typeWriter(element) {
  element.innerHTML = "";

  let reps = 0;
  let timer = 125;

  let interval = setInterval(() => {
    element.innerHTML += message[reps];
    reps++;
    if (reps === message.length) {
      console.log("clear interval");
      clearInterval(interval);
    }
  }, timer);
}

// let typeInterval = setInterval(typeWriter, 10000, titleEl);
typeWriter(titleEl);
