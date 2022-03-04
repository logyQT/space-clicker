const Save = window.localStorage;
import Toast from "./toast.js";
import defaults from "./defaults.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const toast = new Toast();
export default class Game {
  constructor() {
    this.buyAmmount = 1;
    this.init();
    this.tick();
    this.autosave();
  }
  init() {
    if (Save.getItem("save")) {
      let game = JSON.parse(Save.getItem("game"));
      this.player = game.player;
      this.upgrades = game.upgrades;
      this.autosaveDelay = game.autosaveDelay;
      this.skins = game.skins;
      toast.show("Save loaded!");
      this.offlineProgress((Date.now() - game.timestamp) / 1000);
    } else {
      console.log("Could not find a valid save file! \nSetting initial values!");
      this.autosaveDelay = defaults.autosaveDelay;
      this.player = defaults.player;
      this.upgrades = defaults.upgrades;
      this.skins = defaults.skins;
    }
    this.updateDisplay(true);
    this.checkSkins();
  }

  checkSkins() {
    Object.keys(this.skins).forEach((s) => {
      switch (this.skins[s].unlocked) {
        case true: {
          switch (this.skins[s].selected) {
            case true: {
              $(`.${this.skins[s].name}`).classList.add("selected-skin");
              this.selectSkin(this.skins[s].name);
            }
            case false: {
              break;
            }
          }
          break;
        }
        case false: {
          $(`.${this.skins[s].name}`).classList.add("locked");
          break;
        }
      }
    });
  }

  selectSkin(skin) {
    switch (this.skins[skin].unlocked) {
      case true: {
        Object.keys(this.skins).forEach((s) => {
          switch (this.skins[s].type == this.skins[skin].type) {
            case true: {
              this.skins[s].selected = false;
              $(`.${this.skins[s].name}`).classList.remove("selected-skin");
              break;
            }
            case false: {
              break;
            }
          }
          this.skins[skin].selected = true;
        });
        $(`.${skin}`).classList.add("selected-skin");
        switch (this.skins[skin].type == "rocket") {
          case true: {
            $(".rocket-button").style.backgroundImage = `url(${this.skins[skin].url})`;
            break;
          }
          case false: {
            $(".background").style.backgroundImage = `url(${this.skins[skin].url})`;
            break;
          }
        }
        break;
      }
      case false: {
        toast.show("You have not unlocked this skin!");
        break;
      }
    }
    this.save();
  }

  changeBuyAmmount(button) {
    this.buyAmmount = Number(button.target.innerText.substring(1));
    this.updateDisplay(true);
  }

  buyUpgrade(button) {
    let buttonID = button.className;
    let upgradeID = buttonID.split(" ")[0];
    let upgrade = this.upgrades[upgradeID];
    let cost = this.calcCost(upgrade);
    switch (this.player.money >= cost) {
      case true:
        this.player.speed += upgrade.speed * this.buyAmmount;
        this.player.money -= cost;
        upgrade.cost += cost * upgrade.penatly;
        upgrade.lvl += 1 * this.buyAmmount;
        toast.show(`Bought ${upgrade.name} x1`);
        break;
      default:
        toast.show(`Not enough money to buy ${upgrade.name} x${this.buyAmmount}`);
        break;
    }
    this.updateDisplay(upgrade);
  }

  calcCost(upgrade) {
    let total_cost = upgrade.cost;
    let cost = upgrade.cost;
    for (let i = 0; i < this.buyAmmount - 1; i++) {
      cost += cost * upgrade.penatly;
      total_cost += cost;
    }
    return total_cost;
  }

  formatDisplay(num, digits, type = false) {
    let temp = num;
    switch (type) {
      case true: {
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
      case false: {
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
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  updateDisplay(upgrade = false) {
    let displayElements = $(".section1").children;

    displayElements[0].innerText = `Money 
    ${this.formatDisplay(this.player.money, 1, true)}`;

    displayElements[1].innerText = `Distance
    ${this.formatDisplay(this.player.distance, 1)}`;

    displayElements[2].innerText = `Speed
    ${this.formatDisplay(this.player.speed, 1)}`;

    switch (upgrade) {
      case false:
        break;
      case true:
        Object.keys(this.upgrades).forEach((u) => {
          this.updateDisplay(this.upgrades[u]);
        });
        break;
      default:
        let cost = this.calcCost(upgrade);
        let upgradeElements = $(`.${upgrade.name}`).children;
        upgradeElements[0].innerText = `${this.capitalize(upgrade.name)}
        x${this.buyAmmount}`;
        upgradeElements[1].innerText = `Level 
        ${upgrade.lvl}`;

        upgradeElements[2].innerText = `Cost
        ${this.formatDisplay(cost, 1, true)}`;

        upgradeElements[3].innerText = `Speed
        ${this.formatDisplay(upgrade.speed * this.buyAmmount, 1)}`;
        break;
    }
  }

  move() {
    this.player.distance += this.player.speed * this.player.bonus;
    this.player.money += (this.player.speed / this.player.ratio) * this.player.bonus;
    this.updateDisplay();
  }

  offlineProgress(awayTime) {
    this.player.distance += (this.player.speed / this.player.afkRatio) * awayTime * this.player.bonus;
    this.player.money += (this.player.speed / this.player.ratio / this.player.afkRatio) * awayTime * this.player.bonus;
    toast.show(`Offline earnings: ${this.formatDisplay((this.player.speed / this.player.ratio / this.player.afkRatio) * awayTime, 1, true)}`, 100000);
    this.updateDisplay();
  }

  tick() {
    setInterval(() => {
      this.player.distance += (this.player.speed / this.player.afkRatio) * this.player.bonus;
      this.player.money += (this.player.speed / this.player.ratio / this.player.afkRatio) * this.player.bonus;
      this.updateDisplay();
    }, this.player.tickSpeed);
  }

  restart() {
    Save.clear();
    toast.show("Let's start from scratch");
    this.init();
    location.reload();
  }

  save() {
    this.timestamp = Date.now();
    Save.setItem("save", true);
    Save.setItem("game", JSON.stringify(this));
    toast.show("Saved the game!");
    console.log("Saved the game!");
  }

  autosave() {
    setInterval(() => {
      this.save();
    }, this.autosaveDelay);
  }

  autosaveSetting(button) {
    let dict = {
      "30s": 30000,
      "1m": 60000,
      "5m": 300000,
      "10m": 600000,
    };
    this.autosaveDelay = dict[button.target.innerText];
    this.save();
    location.reload();
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

    if (missingUpgrades && removedUpgrades && savedPlayerProperties && removedPlayerProperties) {
      return true;
    } else {
      return false;
    }
  }
}
