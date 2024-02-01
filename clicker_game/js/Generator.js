import { game, subtractUnits, fps, genContainerEl } from "./script.js";

// objects
export function Generator(name, color, cost, units, costGrowth, unitGrowth) {
  this.name = name;
  this.color = color;
  this.cost = cost;
  this.units = units;
  this.unitGrowth = unitGrowth;
  this.costGrowth = costGrowth;

  this.unitMulti = 1;
  this.quantity = 0;
  this.canPurchase = false;
  this.html;
  this.button;

  this.generateUnits = (u, m) => (game.units += u * m);
  this.changeUnits = (u) => (this.units = u);
  this.changeCost = (c) => (this.cost = c);
  this.changeQuantity = (q) => (this.quantity += q);

  this.purchaseGenerator = function () {
    let pq = game.purchaseQuantity;
    let [costInfo, unitsInfo] = this.checkCostAndUnits(pq);

    this.changeUnits(unitsInfo.nextUnits);
    this.changeCost(costInfo.nextCost);
    this.changeQuantity(game.purchaseQuantity);
    subtractUnits(costInfo.totalCost);
  };

  this.gameTick = setInterval(() => {
    this.checkCanPurchase();
  }, fps);

  this.checkCanPurchase = function () {
    let cost = this.checkCostAndUnits(game.purchaseQuantity)[0].totalCost;

    if (cost <= game.units && this.canPurchase === false) {
      this.canPurchase = true;
      this.html.children[3].classList.toggle("can-not-purchase");
    } else if (cost > game.units && this.canPurchase === true) {
      this.canPurchase = false;
      this.html.children[3].classList.toggle("can-not-purchase");
    }
  };

  this.updateUI = function () {};

  this.checkCostAndUnits = function (pq) {
    let totalCostAcc = 0;
    let totalUnitsAcc = this.units;
    let tempCost = this.cost;
    let tempUnits = this.units;

    for (let i = 0; i < pq; i++) {
      totalCostAcc += tempCost;
      totalUnitsAcc += tempUnits;

      tempCost = Math.round(tempCost + tempCost * costGrowth);
      tempUnits = Math.round(tempUnits + tempUnits * unitGrowth);
    }

    return [
      { totalCost: totalCostAcc, nextCost: tempCost },
      { totalUnits: totalUnitsAcc, nextUnits: tempUnits },
    ];
  };

  this.createHTML = function () {
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
  };

  this.init = function () {
    game.generatorsList.push(this);
    this.createHTML();
  };

  this.init();
}
