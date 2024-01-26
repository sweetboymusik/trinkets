// import elements from DOM
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".op");
const output = document.querySelector("output");
const clear = document.querySelector(".clear");
const dot = document.querySelector(".dot");
const sign = document.querySelector(".sign");

// app state object
const appState = {
  prevNum: "0",
  currentNum: "0",
  result: 0,
  operator: "add",
  firstInput: true,

  reset: function () {
    appState.prevNum = "0";
    appState.currentNum = "0";
    appState.result = 0;
    appState.operator = "add";
    appState.firstInput = true;
    updateUI();
  },
};

// on app load
updateUI();

// functions
function updateUI() {
  let op;

  switch (appState.operator) {
    case "add":
      op = " + ";
      break;
    case "sub":
      op = " &minus; ";
      break;
    case "mult":
      op = " &times; ";
      break;
    case "div":
      op = " &div; ";
      break;
  }

  if (appState.firstInput) {
    output.children[0].innerHTML = appState.currentNum;
  } else {
    output.children[0].innerHTML = appState.prevNum + op + currentNum;
  }

  output.children[1].innerHTML = appState.result;
}

function changeNumberState() {
  // if there is a decimal, don't add another
  if (this === dot && appState.currentNum.includes(".")) {
    return;
  }

  // if zero is the first number pressed.
  if (this.innerHTML === "0") {
    if (appState.currentNum[0] === "0") {
      return;
    }
  }

  // any number pressed
  if (appState.currentNum[0] === "0") {
    output.children[0].innerHTML = "";
    appState.currentNum = this.innerHTML;
  } else {
    appState.currentNum += this.innerHTML;
  }

  appState.result = calculate(
    appState.prevNum,
    appState.currentNum,
    appState.operator
  );

  updateUI();
}

function changeOperatorState() {
  appState.operator = this.id;
  appState.prevNum = appState.result;
  appState.currentNum = "";
  appState.firstInput
    ? (appState.firstInput = !appState.firstInput)
    : (appState.firstInput = appState.firstInput);
  updateUI();
}

function calculate(num1, num2, operator) {
  const a = parseFloat(num1);
  const b = parseFloat(num2);

  console.log(a, b);

  let result = 0;

  if (operator === "add") {
    result = a + b;
  }

  if (operator === "sub") {
    result = a - b;
  }

  if (operator === "mult") {
    result = a * b;
  }

  if (operator === "div") {
    result = a / b;
  }

  if (result % 1 === 0) {
    return result;
  } else {
    return parseFloat(result.toFixed(6));
  }
}

// event handlers
numbers.forEach((number) =>
  number.addEventListener("click", changeNumberState)
);

operators.forEach((operator) =>
  operator.addEventListener("click", changeOperatorState)
);

dot.addEventListener("click", changeNumberState);
clear.addEventListener("click", appState.reset);

sign.addEventListener("click", () => {
  if (output.children[0].innerHTML[0] !== "-") {
  } else {
    output.children[0].innerHTML = output.children[1].innerHTML.replace(
      "-",
      ""
    );
  }
});
