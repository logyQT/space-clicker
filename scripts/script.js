// Creating upgrade buttons
const upgradesList = Object.keys(defaults.upgrades);
upgradesList.forEach((item) => {
  let div = document.createElement("div");
  div.className = `${item} upgrade`;
  document.querySelector(".shop-page").appendChild(div);
  for (let i = 0; i < 4; i++) {
    let p = document.createElement("p");
    div.appendChild(p);
  }
});

import Game from "./Game.js";
import defaults from "./defaults.js";
const game = new Game();

const rocket = document.querySelector(".rocket-button");
const pages = document.querySelector(".section4").children;
const pageSwitchButtons = document.querySelector(".section3").children;
const upgradeButtons = document.querySelector(".shop-page").children;
const saveButton = document.querySelector(".save-button");
const restartButton = document.querySelector(".restart-button");
const importButton = document.querySelector(".import-button");
const exportButton = document.querySelector(".export-button");
const container = document.querySelector(".container");
const autosaveButtons = document.querySelector(".autosave").children;

// Increment the numbers when rocket is clicked
switch (screen.width < 700) {
  case true: {
    container.style.gridTemplateRows = "10% 80% 10% 0%";
    rocket.addEventListener("touchstart", () => {
      game.move();
      container.style.gridTemplateRows = "10% 80% 10% 0%";
      for (let j = 0; j < pageSwitchButtons.length; j++) {
        pageSwitchButtons[j].classList.remove("clicked");
      }
    });
    break;
  }
  default: {
    rocket.addEventListener("click", () => {
      game.move();
    });
    break;
  }
}

// Page switching
for (let i = 0; i < pageSwitchButtons.length; i++) {
  pageSwitchButtons[i].addEventListener("click", (b) => {
    switch (screen.availWidth < 700) {
      case true: {
        if (!b.target.classList.contains("clicked")) {
          for (let j = 0; j < pageSwitchButtons.length; j++) {
            pageSwitchButtons[j].classList.remove("clicked");
          }
          b.target.classList.add("clicked");
          container.style.gridTemplateRows = "10% 50% 10% 30%";
        } else {
          b.target.classList.remove("clicked");
          container.style.gridTemplateRows = "10% 80% 10% 0%";
        }
        break;
      }
    }
    for (let j = 0; j < pages.length; j++) {
      pages[j].className = "hidden";
    }
    pages[i].classList.remove("hidden");
    pages[i].classList.add(`${pageSwitchButtons[i].className.split("-")[0]}-page`);
  });
}

// Upgrade buttons
for (let i = 0; i < upgradeButtons.length; i++) {
  upgradeButtons[i].addEventListener("click", () => {
    game.buyUpgrade(upgradeButtons[i]);
  });
}

// Save button
saveButton.addEventListener("click", () => {
  game.save();
});

// Restart button
restartButton.addEventListener("click", () => {
  game.restart();
});

// Import button
importButton.addEventListener("click", () => {
  game.import();
});

// Export button
exportButton.addEventListener("click", () => {
  game.export();
});

// Game loop
game.tick(1000);

// Autosave
for (let i = 1; i < autosaveButtons.length; i++) {
  autosaveButtons[i].addEventListener("click", (button) => {
    game.autosaveSetting(button);
  });
}
game.autosave();
