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
        let savedUpgrades = Object.keys(game.upgrades);
        let defaultUpgrades = Object.keys(defaults.upgrades);
        let missingUpgrades = defaultUpgrades.filter((item) => !savedUpgrades.includes(item));
        let removedUpgrades = savedUpgrades.filter((item) => !defaultUpgrades.includes(item));

        let savedPlayerProperties = Object.keys(game.player);
        let defaultPlayerProperties = Object.keys(defaults.player);
        let missingPlayerProperties = defaultPlayerProperties.filter((item) => !savedPlayerProperties.includes(item));
        let removedPlayerProperties = savedPlayerProperties.filter((item) => !defaultPlayerProperties.includes(item));
        console.log(missingUpgrades, removedUpgrades, missingPlayerProperties, removedPlayerProperties);

        this.player = game.player;
        this.upgrades = game.upgrades;

        missingUpgrades.forEach((u) => {
          this.upgrades[u] = defaults.upgrades[u];
        });
        removedUpgrades.forEach((u) => {
          delete this.upgrades[u];
        });
        missingPlayerProperties.forEach((p) => {
          this.player[p] = defaults.player[p];
        });
        removedPlayerProperties.forEach((p) => {
          delete this.player[p];
        });

        this.version = defaults.version;
        Toast.show("Save successfully updated!");
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
        Toast.show(`Not enoguht money to buy ${this.upgrade.name} x1`);
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

  updateDisplay(upgrade = false) {
    let displayElements = document.getElementsByClassName("section1")[0].children;

    displayElements[0].innerText = `Money 
    ${this.formatMoney(this.player.money, 2)}`;

    displayElements[1].innerText = `Distance
    ${this.player.distance}`;

    displayElements[2].innerText = `Speed
    ${this.player.speed}`;

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
        ${upgrade.speed}`;
        break;
    }
  }

  move() {
    this.player.distance += this.player.speed;
    this.player.money += this.player.speed / this.player.ratio;
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

  _buyAmmount(button, buttons) {
    buttons.forEach((b) => {
      b.className = "clickable";
    });
    button.className = "clickable selected";
    this.buyAmmount = Number(button.innerText);
    this.updateDisplay(true);
  }
}
