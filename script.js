import { randomInteger, fetchColors } from './functions.js';

let clickedPanels = [];
const winSection = document.querySelector('.section');
let wrapper = document.querySelector('.wrapper');
const nextGameButton = document.querySelector('button');
const yourTime = document.querySelector('p');
let winCounter = 0;

class Panel {
  constructor(color) {
    this.color = color;
  }

  createPanel(appendTo) {
    const panel = document.createElement('div');
    panel.classList.add('panel');
    panel.style.backgroundColor = this.color;

    panel.addEventListener('click', () => {
      panel.style.backgroundColor = this.color;
      clickedPanels.push(panel);

      if (clickedPanels.length == 2) {
        preventFromClicking('none');
        if (
          clickedPanels[0] != clickedPanels[1] &&
          clickedPanels[0].style.backgroundColor === clickedPanels[1].style.backgroundColor
        ) {
          clickedPanels[0].setAttribute('data', 'blocked');
          clickedPanels[1].setAttribute('data', 'blocked');
          timeoutFromClicking('black');
        } else {
          preventFromClicking('none');
          timeoutFromClicking('white');
        }
      }
    });
    appendTo.appendChild(panel);
  }
}

const timeoutFromClicking = (color) => {
  setTimeout(function () {
    clickedPanels[0].style.backgroundColor = color;
    clickedPanels[1].style.backgroundColor = color;
    clickedPanels = [];
    preventFromClicking('auto');
  }, 500);
};

async function startGame() {
  const colorsTable = await fetchColors();
  const number = randomInteger(0, 134);
  const table = colorsTable.slice(number, number + 12);

  for (let i = 0; i < 24; i++) {
    if (i >= 2 && i % 2 == 0) table.pop();
    let panel = new Panel(table[table.length - 1]);
    panel.createPanel(wrapper);
  }

  [...document.querySelectorAll('.panel')].forEach((panel) => {
    panel.style.pointerEvents = 'none';
    panel.style.order = randomInteger(0, 24);
    setTimeout(function () {
      panel.style.backgroundColor = 'white';
      panel.style.pointerEvents = 'auto';
    }, 1500);
  });
}

let tableToSwitchPointerEventsValue = [];

const preventFromClicking = (pointerEventsValue) => {
  tableToSwitchPointerEventsValue = [...document.querySelectorAll('.panel')].filter((el) => {
    return el.getAttribute('data') != 'blocked';
  });

  tableToSwitchPointerEventsValue.forEach((panel) => {
    panel.style.pointerEvents = pointerEventsValue;
  });

  winCheck(tableToSwitchPointerEventsValue);
};

nextGameButton.addEventListener('click', () => {
  wrapper.innerHTML = '';
  startGame();
  winSection.classList.remove('show');
  document.querySelector('.timer').innerText = '00:00';
  timer.start();
});

const winCheck = (table) => {
  if (table.length == 0) {
    timer.stop();
    document.querySelector('.timer').innerText = '';
    winSection.classList.add('show');
    winCounter++;
    if (winCounter >= 2) {
      const img = (document.querySelector('img').src = './img/win.jpg');
    }
  }
};

var timer = new Timer();
timer.start();
timer.addEventListener('secondsUpdated', function () {
  $('.timer').html(formatDisplayTime(timer.getTimeValues().minutes, timer.getTimeValues().seconds));
});

const formatDisplayTime = (minutes, seconds) => {
  if (minutes >= 5) timer.stop();

  if (seconds < 10) {
    yourTime.innerText = `Your time 0${timer.getTimeValues().minutes}:0${timer.getTimeValues().seconds}`;
    return `0${minutes}:0${seconds}`;
  } else {
    yourTime.innerText = `Your time 0${timer.getTimeValues().minutes}:${timer.getTimeValues().seconds}`;
    return `0${minutes}:${seconds}`;
  }
};

startGame();
