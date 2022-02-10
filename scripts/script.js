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
switch (screen.width < 700) {
  case true: {
    rocket.addEventListener("touchstart", () => {
      game.move();
    });
    /*let video = document.getElementsByClassName("backgroundVideo")[0];
    let source = document.createElement("source");

    source.setAttribute("src", "https://logyqt.github.io/space-clicker/images/background_mobile.mp4");
    source.setAttribute("type", "video/mp4");

    video.appendChild(source);
    video.play();*/
    break;
  }
  default: {
    rocket.addEventListener("click", () => {
      game.move();
    });
    /*let video = document.getElementsByClassName("backgroundVideo")[0];
    let source = document.createElement("source");

    source.setAttribute("src", "https://logyqt.github.io/space-clicker/images/background2.mp4");
    source.setAttribute("type", "video/mp4");

    video.appendChild(source);
    video.play();*/
    break;
  }
}
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
  game.tick();
}, 100);

setInterval(() => {
  game.save();
}, 30000);
