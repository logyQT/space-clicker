import Game from "./Game.js";
import defaults from "./defaults.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Creating upgrade buttons
const upgradesList = Object.keys(defaults.upgrades);
upgradesList.forEach((item) => {
  let div = document.createElement("div");
  div.className = `${item} upgrade`;
  document.querySelector(".upgrade-page").appendChild(div);
  for (let i = 0; i < 4; i++) {
    let p = document.createElement("p");
    div.appendChild(p);
  }
});

// Creating skin buttons
const skinList = Object.keys(defaults.skins);
skinList.forEach((skin) => {
  let div = document.createElement("div");
  let p = document.createElement("p");
  p.innerText = `${defaults.skins[skin].displayName}`;
  div.appendChild(p);
  div.className = `${defaults.skins[skin].name} skin-card`;
  div.style.backgroundImage = `url(${defaults.skins[skin].icon_url})`;
  document.querySelector(".skins-page").appendChild(div);
});

const game = new Game();

const rocket = $(".rocket-button");
const pages = $(".section4").children;
const pageSwitchButtons = $(".section3").children;
const upgradeButtons = $(".upgrade-page").children;
const saveButton = $(".save-button");
const restartButton = $(".restart-button");
const importButton = $(".import-button");
const exportButton = $(".export-button");
const container = $(".container");
const autosaveButtons = $(".autosave").children;
const buyAmmountButtons = $(".ammount-container").children;
const section3 = $(".section3");
const skinButtons = $$(".skin-card");

// section3 horizontal scrolling
section3.addEventListener("wheel", (evt) => {
  evt.preventDefault();
  section3.scrollBy({
    top: 0,
    left: evt.deltaY * 100,
    behavior: "smooth",
  });
});

skinButtons.forEach((b) => {
  b.addEventListener("click", (b) => {
    game.selectSkin(b);
  });
});

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

// Buy ammount buttons
for (let i = 0; i < buyAmmountButtons.length; i++) {
  buyAmmountButtons[i].addEventListener("click", (button) => {
    game.changeBuyAmmount(button);
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

// Autosave settings buttons
for (let i = 1; i < autosaveButtons.length; i++) {
  autosaveButtons[i].addEventListener("click", (button) => {
    game.autosaveSetting(button);
  });
}
