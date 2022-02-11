const Save = window.localStorage;
import Toast from "./toast.js";
import defaults from "./defaults.js";
const toast = new Toast();
export default class Game {
  constructor() {
    this.buyAmmount = 1;
    this.init();
  }
  init() {
    if (Save.getItem("save")) {
      let game = JSON.parse(Save.getItem("game"));
      this.player = game.player;
      this.upgrades = game.upgrades;
      toast.show("Save loaded!");
      console.log({ saved: game.timestamp, loaded: Date.now(), diffrence: Date.now() - game.timestamp });
      this.move(10, (Date.now() - game.timestamp) / 1000);
    } else {
      console.log("Could not find a valid save file! \nSetting initial values!");
      this.player = defaults.player;
      this.upgrades = defaults.upgrades;
    }
    this.updateDisplay(true);
  }

  buyUpgrade(button) {
    let buttonID = button.className;
    let upgradeID = buttonID.split(" ")[0];
    this.upgrade = this.upgrades[upgradeID];
    let cost = this.upgrade.cost;
    for (let i = 0; i < this.buyAmmount - 1; i++) {
      cost += cost * this.upgrade.penatly;
    }
    switch (this.player.money >= cost) {
      case true:
        this.player.speed += this.upgrade.speed * this.buyAmmount;
        this.player.money -= cost;
        this.upgrade.cost += cost * this.upgrade.penatly;
        this.upgrade.lvl += 1 * this.buyAmmount;
        toast.show(`Bought ${this.upgrade.name} x1`);
        break;
      default:
        toast.show(`Not enough money to buy ${this.upgrade.name} x${this.buyAmmount}`);
        break;
    }
    this.updateDisplay(this.upgrade);
  }

  formatMoney(num, digits) {
    let temp = num;
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: " k" },
      { value: 1e6, symbol: " M" },
      { value: 1e9, symbol: " B" },
      { value: 1e12, symbol: " T" },
      { value: 1e15, symbol: " QA" },
      { value: 1e18, symbol: " QI" },
      { value: 1e21, symbol: " SX" },
      { value: 1e24, symbol: " SP" },
      { value: 1e27, symbol: " O" },
      { value: 1e30, symbol: "N" },
      { value: 1e33, symbol: "D" },
      { value: 1e36, symbol: " UD" },
      { value: 1e39, symbol: " DD" },
      { value: 1e42, symbol: " TD" },
      { value: 1e45, symbol: " QD" },
    ];

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : temp.toFixed(digits);
  }

  formatDistance(num, digits) {
    let temp = num;
    const lookup = [
      { value: 1, symbol: " m" },
      { value: 1e3, symbol: " km" },
      { value: 1e6, symbol: " Mm" },
      { value: 2.998e8, symbol: " ls" },
      { value: 1.799e10, symbol: " lm" },
      { value: 1.079e12, symbol: " lh" },
      { value: 2.59e13, symbol: " ld" },
      { value: 1.813e14, symbol: " lw" },
      { value: 9.461e15, symbol: " ly" },
      { value: 3.086e16, symbol: " pc" },
      { value: 3.086e22, symbol: " Mpc" },
      { value: 3.086e25, symbol: " Gpc" },
      { value: 3.086e28, symbol: " Tpc" },
      { value: 3.086e31, symbol: " Ppc" },
      { value: 3.086e34, symbol: " Epc" },
      { value: 3.086e37, symbol: " Zpc" },
      { value: 3.086e40, symbol: " Ypc" },
    ];

    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : temp.toFixed(digits);
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  updateDisplay(upgrade = false) {
    let displayElements = document.getElementsByClassName("section1")[0].children;

    displayElements[0].innerText = `Money 
    ${this.formatMoney(this.player.money, 1)}`;

    displayElements[1].innerText = `Distance
    ${this.formatDistance(this.player.distance, 1)}`;

    displayElements[2].innerText = `Speed
    ${this.formatDistance(this.player.speed, 1)}`;

    switch (upgrade) {
      case false:
        break;
      case true:
        Object.keys(this.upgrades).forEach((u) => {
          this.updateDisplay(this.upgrades[u]);
        });
        break;
      default:
        let upgradeElements = document.getElementsByClassName(upgrade.name)[0].children;
        upgradeElements[0].innerText = `${this.capitalize(upgrade.name)}
        x${this.buyAmmount}`;
        upgradeElements[1].innerText = `Level 
        ${upgrade.lvl}`;

        upgradeElements[2].innerText = `Cost
        ${this.formatMoney(upgrade.cost, 1)}`;

        upgradeElements[3].innerText = `Speed
        ${this.formatDistance(upgrade.speed, 1)}`;
        break;
    }
  }

  move(idle = 1, x = 1) {
    this.player.distance += (this.player.speed / idle) * x;
    this.player.money += (this.player.speed / this.player.ratio / idle) * x;
    this.updateDisplay();
    switch (x != 1) {
      case true: {
        console.log(this.player.speed / this.player.ratio / idle) * x;
        toast.show(`Offline earnings: ${this.formatMoney((this.player.speed / this.player.ratio / idle) * x, 1)}`, 10000);
        break;
      }
      default: {
        break;
      }
    }
  }

  tick(t) {
    setInterval(() => {
      this.move(10, 1);
    }, t);
  }

  restart() {
    Save.clear();
    toast.show("Let's start from scratch");
    this.init();
    console.log("Save cleared!");
  }

  save() {
    this.timestamp = Date.now();
    Save.setItem("save", true);
    Save.setItem("game", JSON.stringify(this));
    toast.show("Saved the game!");
    console.log("Saved the game!");
  }

  export() {
    let textarea = document.getElementsByClassName("import-export-area")[0];
    this.save();
    textarea.value = btoa(JSON.stringify(this));
    textarea.focus();
    textarea.select();
  }

  import() {
    function __atob(obj) {
      try {
        atob(obj);
        return true;
      } catch {
        return false;
      }
    }
    function __json(obj) {
      try {
        JSON.parse(obj);
        return true;
      } catch {
        return false;
      }
    }
    let txv = document.getElementsByClassName("import-export-area")[0].value;

    if (!__atob(txv)) {
      return false;
    }
    if (!__json(atob(txv))) {
      return false;
    }

    if (!this.validate(JSON.parse(atob(txv)))) {
      return false;
    }

    let game = JSON.parse(atob(txv));
    this.player = game.player;
    this.upgrades = game.upgrades;
    toast.show("Save imported!");
    this.updateDisplay();
  }

  validate(game) {
    let savedUpgrades = Object.keys(game.upgrades);
    let defaultUpgrades = Object.keys(defaults.upgrades);
    let missingUpgrades = defaultUpgrades.filter((item) => !savedUpgrades.includes(item));
    let removedUpgrades = savedUpgrades.filter((item) => !defaultUpgrades.includes(item));

    let savedPlayerProperties = Object.keys(game.player);
    let defaultPlayerProperties = Object.keys(defaults.player);
    let missingPlayerProperties = defaultPlayerProperties.filter((item) => !savedPlayerProperties.includes(item));
    let removedPlayerProperties = savedPlayerProperties.filter((item) => !defaultPlayerProperties.includes(item));

    console.log(missingUpgrades, removedUpgrades, missingPlayerProperties, removedPlayerProperties);

    if (missingUpgrades && removedUpgrades && savedPlayerProperties && removedPlayerProperties) {
      return true;
    } else {
      return false;
    }
  }
}
