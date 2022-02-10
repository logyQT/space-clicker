const Save = window.localStorage;
class Game {
  constructor() {
    this.buyAmmount = 1;
    this.init();
  }

  init() {
    if (Save.getItem("save")) {
      let game = JSON.parse(Save.getItem("game"));
      if (game?.version != defaults.version) {
        this.player = defaults.player;
        this.upgrades = defaults.upgrades;
        this.version = defaults.version;
        Toast.show("Your save has been reset due to an update!");
        this.save();
      } else {
        this.player = game.player;
        this.upgrades = game.upgrades;
        Toast.show("Save loaded!");
        console.log("Found a valid save file! \nLoading save file!");
      }
    } else {
      console.log("Could not find a valid save file! \nSetting initial values!");
      this.player = defaults.player;
      this.upgrades = defaults.upgrades;
      this.version = defaults.version;
      game.save();
    }
    this.updateDisplay(true);
  }

  buyUpgrade(button) {
    let buttonID = button.className;
    let upgradeID = buttonID.split(" ")[0];
    this.upgrade = this.upgrades[upgradeID];
    let cost = this.upgrade.cost;

    switch (this.player.money >= cost) {
      case true:
        this.player.speed += this.upgrade.speed;
        this.player.money -= this.upgrade.cost;
        this.upgrade.cost += this.upgrade.cost * this.upgrade.penatly;
        this.upgrade.lvl += 1;
        Toast.show(`Bought ${this.upgrade.name} x1`);
        break;
      default:
        Toast.show(`Not enough money to buy ${this.upgrade.name} x1`);
        break;
    }
    this.updateDisplay(this.upgrade);
  }

  formatMoney(num, digits) {
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
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  formatDistance(num, digits) {
    const lookup = [
      { value: 1, symbol: " m" },
      { value: 1e3, symbol: " km" },
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
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  updateDisplay(upgrade = false) {
    let displayElements = document.getElementsByClassName("section1")[0].children;

    displayElements[0].innerText = `Money 
    ${this.formatMoney(this.player.money, 2)}`;

    displayElements[1].innerText = `Distance
    ${this.formatDistance(this.player.distance, 2)}`;

    displayElements[2].innerText = `Speed
    ${this.formatDistance(this.player.speed, 2)}`;

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
        upgradeElements[1].innerText = `Level 
        ${upgrade.lvl}`;
        upgradeElements[2].innerText = `Cost
        ${this.formatMoney(upgrade.cost, 2)}`;
        upgradeElements[3].innerText = `Speed
        ${this.formatDistance(upgrade.speed, 2)}`;
        break;
    }
  }

  move() {
    this.player.distance += this.player.speed;
    this.player.money += this.player.speed / this.player.ratio;
    this.updateDisplay();
  }

  tick() {
    this.player.distance += this.player.speed / 10;
    this.updateDisplay();
  }

  restart() {
    Save.clear();
    Toast.show("Let's start from scratch");
    this.init();
    console.log("Save cleared!");
  }

  save() {
    Save.setItem("save", true);
    Save.setItem("game", JSON.stringify(this));
    Toast.show("Saved the game!");
    console.log("Saved the game!");
  }
}
