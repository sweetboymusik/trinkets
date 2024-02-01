export class Companion {
  constructor(name, cost, type) {
    this.name = name;
    this.cost = cost;
    this.type = type;
    this.price = 13;
    this.#init();
  }

  testFunction() {
    this.#private();
  }

  print(text) {
    console.log(text);
  }

  #private() {
    console.log(this.price);
  }

  #init() {
    console.log(`${this.name} created`);
  }

  createHTML() {
    let container = document.createElement("div");
    let label = document.createElement("span");
    let block = document.createElement("div");
    let info = document.createElement("p");
    let button = document.createElement("button");

    container.classList.add("generator");
    label.classList.add("generator-label");
    block.classList.add("generator-img");
    button.classList.add("generator-btn", "can-not-purchase");

    block.style.backgroundColor = this.color;

    label.textContent = `${this.units}u /s`;
    block.textContent = this.quantity;
    info.textContent = `${this.cost}u x${game.purchaseQuantity}`;
    button.textContent = `Purchase`;

    container.appendChild(label);
    container.appendChild(block);
    container.appendChild(info);
    container.appendChild(button);

    this.html = genContainerEl.appendChild(container);
    this.button = this.html.children[3];
    this.button.addEventListener("click", this.purchaseGenerator.bind(this));
  }
}
