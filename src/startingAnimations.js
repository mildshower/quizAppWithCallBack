const { stdin, stdout } = process;
const chalk = require("chalk");
const { intervalCall, spaces, printAt, clearScreen } = require("./utils.js");
const { Say } = require("say");
const say = new Say();

const startCountDown = function(startColumn, startRow) {
  const digitDisplayerFuncs = [show3, show2, show1];
  let count = 0;
  const timerID = setInterval(() => {
    digitDisplayerFuncs[count](startRow + 7, startColumn + 32);
    if (count == 2) clearInterval(timerID);
    count++;
  }, 1500);
};

const showIcon = function(startColumn, startRow) {
  clearScreen();
  say.speak("welcome to quiz app", "Samantha");
  printAt(
    chalk.yellow.bold(
      "||||||||    |||  |||   |||   ||||||||        ||||||||  ||||||||  ||||||||"
    ),
    startColumn,
    startRow
  );
  printAt(
    chalk.yellow.bold(
      "|||  |||    |||  |||   |||       ///         |||  |||  |||  |||  |||  |||"
    ),
    startColumn,
    startRow + 1
  );
  printAt(
    chalk.white.bold(
      "|||  |||    |||  |||   |||      ///          |||  |||  |||  |||  |||  |||"
    ),
    startColumn,
    startRow + 2
  );
  printAt(
    chalk.white.bold(
      "|||  |||    |||  |||   |||     ///           ||||||||  ||||||||  ||||||||"
    ),
    startColumn,
    startRow + 3
  );
  printAt(
    chalk.green.bold(
      "|||  \\\\\\    |||  |||   |||    ///            |||  |||  |||       |||"
    ),
    startColumn,
    startRow + 4
  );
  printAt(
    chalk.green.bold(
      "||||||\\\\\\   ||||||||   |||   ||||||||        |||  |||  |||       |||"
    ),
    startColumn,
    startRow + 5
  );
};

const show3 = function(row, column) {
  say.speak("three", "Samantha");
  printAt(chalk.redBright.bold("||||||||"), column, row++);
  printAt(chalk.redBright.bold("     |||"), column, row++);
  printAt(chalk.redBright.bold("     |||"), column, row++);
  printAt(chalk.redBright.bold(" |||||||"), column, row++);
  printAt(chalk.redBright.bold("     |||"), column, row++);
  printAt(chalk.redBright.bold("     |||"), column, row++);
  printAt(chalk.redBright.bold("||||||||"), column, row++);
};

const show2 = function(row, column) {
  say.speak("two", "Samantha");
  printAt(chalk.yellowBright.bold("||||||||"), column, row++);
  printAt(chalk.yellowBright.bold("||   ///"), column, row++);
  printAt(chalk.yellowBright.bold("    /// "), column, row++);
  printAt(chalk.yellowBright.bold("   ///  "), column, row++);
  printAt(chalk.yellowBright.bold("  ///   "), column, row++);
  printAt(chalk.yellowBright.bold(" ///    "), column, row++);
  printAt(chalk.yellowBright.bold("||||||||"), column, row++);
};

const show1 = function(row, column) {
  say.speak("one", "Samantha");
  printAt(chalk.greenBright.bold("///|||  "), column, row++);
  printAt(chalk.greenBright.bold("   |||  "), column, row++);
  printAt(chalk.greenBright.bold("   |||  "), column, row++);
  printAt(chalk.greenBright.bold("   |||  "), column, row++);
  printAt(chalk.greenBright.bold("   |||  "), column, row++);
  printAt(chalk.greenBright.bold("   |||  "), column, row++);
  printAt(chalk.greenBright.bold("||||||||"), column, row++);
};

const runOpeningAnimation = function() {
  const startColumn = Math.ceil(stdout.columns / 2 - 36);
  const startRow = Math.ceil(stdout.rows / 2 - 5);
  showIcon(startColumn, startRow);
  startCountDown(startColumn, startRow);
};

exports.runOpeningAnimation = runOpeningAnimation;
