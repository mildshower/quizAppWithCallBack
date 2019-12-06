const { stdout } = process;
const chalk = require("chalk");

const loadSideChar = function(xAxis, yAxis, color) {
  stdout.cursorTo(xAxis, yAxis);
  stdout.write(chalk[color].bold("★"));
};

const loadRepChar = function(xAxis, yAxis, color) {
  for (let i = 0; i <= 1; i++) {
    loadSideChar(xAxis, yAxis - i, color);
  }
};

const loadVerticalLine = function(clr, inc, dir, startX, startY, stop, pos) {
  let xAxis = startX;
  let yAxis = startY;
  return function() {
    loadRepChar(xAxis, yAxis, "redBright");
    loadRepChar(xAxis, yAxis - pos, "blueBright");
    loadRepChar(xAxis, yAxis - pos * 2, "greenBright");
    stdout.cursorTo(xAxis, yAxis - pos * 2 - clr);
    stdout.clearLine(dir);
    if (startY < stop && yAxis >= stop) {
      for (let i = 8; i >= 0; i--) {
        stdout.cursorTo(xAxis, yAxis - i);
        stdout.clearLine(dir);
      }
      yAxis = startY;
    }
    if (startY > stop && yAxis <= stop) {
      for (let i = -2; i <= 6; i++) {
        stdout.cursorTo(xAxis, yAxis + i);
        stdout.clearLine(dir);
      }
      yAxis = startY;
    }
    yAxis += inc;
  };
};

const loadHorizentalLine = function(inc, startX, startY, stopX, charLength) {
  let xAxis = startX;
  let yAxis = startY;
  return function() {
    stdout.cursorTo(xAxis, yAxis);
    stdout.clearLine(0);
    let string =
      chalk.redBright.bold("★★★") +
      chalk.blueBright.bold(" ★★★") +
      chalk.greenBright.bold(" ★★★");
    stdout.write(string);
    xAxis += inc;
    if (startX < stopX && xAxis >= stopX - charLength) {
      xAxis = startX;
    }
    if (startX > stopX && xAxis <= stopX + charLength) {
      xAxis = startX;
    }
  };
};

const getHorLineTop1 = loadHorizentalLine(3, 0, 0, stdout.columns, 12);
const getHorLineTop2 = loadHorizentalLine(3, 1, 1, stdout.columns, 11);
const getHorLineDown3 = loadHorizentalLine(
  -3,
  stdout.columns - 12,
  stdout.rows,
  0,
  0
);
const getHorLineDown4 = loadHorizentalLine(
  -3,
  stdout.columns - 11,
  stdout.rows - 2,
  0,
  1
);

const getVerLineRight1 = loadVerticalLine(
  2,
  1,
  1,
  stdout.columns - 1,
  6,
  stdout.rows,
  2
);

const getVerLineRight2 = loadVerticalLine(
  2,
  1,
  1,
  stdout.columns - 3,
  5,
  stdout.rows - 1,
  2
);

const getVerLineLeft1 = loadVerticalLine(-1, -1, -1, 2, stdout.rows - 3, 3, -2);

const getVerLineLeft2 = loadVerticalLine(-1, -1, -1, 0, stdout.rows - 4, 2, -2);

const startBorderAnimation = function() {
  setInterval(() => {
    getHorLineTop1();
    getHorLineTop2();
    getHorLineDown3();
    getHorLineDown4();
    getVerLineRight2();
    getVerLineRight1();
    getVerLineLeft1();
    getVerLineLeft2();
  }, 50);
};

exports.startBorderAnimation = startBorderAnimation;
