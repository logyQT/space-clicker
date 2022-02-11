const rocket = document.getElementsByClassName("rocket-button")[0];

const pages = document.getElementsByClassName("section4")[0].children;
const pageSwitchButtons = document.getElementsByClassName("section3")[0].children;
const upgradeButtons = document.getElementsByClassName("upgrades-page")[0].children;
const saveButton = document.getElementsByClassName("save-button")[0];
const restartButton = document.getElementsByClassName("restart-button")[0];
const importButton = document.getElementsByClassName("import-button")[0];
const exportButton = document.getElementsByClassName("export-button")[0];
const container = document.querySelector(".container");

const section4 = document.getElementsByClassName("section4")[0];
const upgradesPage = document.getElementsByClassName("upgrades-page")[0];

const game = new Game();

// Increment the numbers when rocket is clicked
switch (screen.width < 700) {
  case true: {
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
setInterval(() => {
  game.save();
}, 30000);
