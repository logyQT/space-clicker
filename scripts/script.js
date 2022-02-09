const rocket = document.getElementsByClassName("rocket-button")[0];

const pages = document.getElementsByClassName("section4")[0].children;
const pageSwitchButtons = document.getElementsByClassName("section3")[0].children;
const upgradeButtons = document.getElementsByClassName("upgrades-page")[0].children;
const saveButton = document.getElementsByClassName("save-button")[0];
const restartButton = document.getElementsByClassName("restart-button")[0];

const section4 = document.getElementsByClassName("section4")[0];
const upgradesPage = document.getElementsByClassName("upgrades-page")[0];

const game = new Game();

// Increment the numbers when rocket is clicked
rocket.addEventListener("click", () => {
  game.move();
});

// Page switching
for (let i = 0; i < pageSwitchButtons.length; i++) {
  pageSwitchButtons[i].addEventListener("click", () => {
    for (let j = 0; j < pages.length; j++) {
      pages[j].className = "hidden";
    }
    pages[i].className = `${pageSwitchButtons[i].className.split("-")[0]}-page`;
  });
}

// Upgrade buttons
for (let i = 0; i < upgradeButtons.length; i++) {
  upgradeButtons[i].addEventListener("click", () => {
    game.buyUpgrade(upgradeButtons[i]);
  });
}

//Save button
saveButton.addEventListener("click", () => {
  game.save();
});

//Restart button
restartButton.addEventListener("click", () => {
  game.restart();
});

setInterval(() => {
  game.save();
}, 60000);
