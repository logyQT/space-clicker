const Save = window.localStorage;
class Game {
  constructor(distanceElement, moneyElement, speedElement) {
    this.distanceElement = distanceElement;
    this.moneyElement = moneyElement;
    this.speedElement = speedElement;
    this.buyAmmount = 1;
    this.init();
  }

  init() {
    if (Save.getItem("save")) {
      console.log("Found a valid save file! \nLoading save file!");
      this.player = JSON.parse(Save.getItem("player"));
      this.upgrades = JSON.parse(Save.getItem("upgrades"));
    } else {
      console.log("Could not find a valid save file! \nSetting initial values!");
      this.player = {
        stage: 1,
        money: 15,
        ratio: 5,
        distance: 0,
        speed: 0,
      };
      this.upgrades = {
        engine: {
          name: "engine",
          speed: 1,
          cost: 10,
          lvl: 0,
          penatly: 0.1,
        },
        booster: {
          name: "booster",
          speed: 5,
          cost: 100,
          lvl: 0,
          penatly: 0.1,
        },
      };
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
        this.upgrade.lvl += this.buyAmmount;
        break;
      default:
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
    this.distanceElement.innerText = `Distance: ${Number(this.player.distance).toFixed(2)}`;
    this.moneyElement.innerText = `Money: ${this.formatMoney(this.player.money, 2)}`;
    this.speedElement.innerText = `Speed: ${Number(this.player.speed)}`;
    switch (upgrade) {
      case false:
        break;
      case true:
        Object.keys(this.upgrades).forEach((u) => {
          this.updateDisplay(this.upgrades[u]);
        });
        break;
      default:
        let elements = document.getElementsByClassName(upgrade.name)[0].children;
        elements[1].innerText = `Level: ${upgrade.lvl}`;
        elements[2].innerText = `Cost: ${this.formatMoney(upgrade.cost, 2)}`;
        elements[3].innerText = `Speed: ${upgrade.speed}`;
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
    this.init();
    console.log("Save cleared!");
  }

  save() {
    Save.setItem("save", true);
    Save.setItem("player", JSON.stringify(this.player));
    Save.setItem("upgrades", JSON.stringify(this.upgrades));
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
