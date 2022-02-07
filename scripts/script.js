const moneyElement = document.getElementsByClassName("money")[0];
const distanceElement = document.getElementsByClassName("distance")[0];
const speedElement = document.getElementsByClassName("speed")[0];
const rocket = document.getElementsByClassName("rocket-button")[0];

const pages = document.getElementsByClassName("section4")[0].children;
const pageSwitchButtons = document.getElementsByClassName("section3")[0].children;
const upgradeButtons = document.getElementsByClassName("upgrades-page")[0].children;
const saveButton = document.getElementsByClassName("save-button")[0];
const restartButton = document.getElementsByClassName("restart-button")[0];

const game = new Game(distanceElement, moneyElement, speedElement);

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
