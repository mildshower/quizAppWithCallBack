const { stdin, stdout } = process;
const chalk = require("chalk");
const { intervalCall, spaces, printAt, clearScreen } = require("./utils.js");
const { Say } = require("say");
const say = new Say();

const getLoadBar = function(xAxis, yAxis) {
  return function() {
    stdout.cursorTo(xAxis, yAxis);
    stdout.write(chalk.redBright.bold("◼︎"));
    xAxis++;
  };
};

const showIcon = async function() {
  const startColumn = Math.ceil(stdout.columns / 2 - 36);
  const startRow = Math.ceil(stdout.rows / 2 - 5);
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
  printAt(
    chalk.blueBright.bold("[" + spaces(26) + "]"),
    startColumn + 22,
    startRow + 8
  );
  await intervalCall(getLoadBar(startColumn + 23, startRow + 8), 100, 26);
};

const show3 = function(row, column) {
  clearScreen();
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
  clearScreen();
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
  clearScreen();
  say.speak("one", "Samantha");
  printAt(chalk.greenBright.bold("///|||  "), column, row++);
  printAt(chalk.greenBright.bold("   |||  "), column, row++);
  printAt(chalk.greenBright.bold("   |||  "), column, row++);
  printAt(chalk.greenBright.bold("   |||  "), column, row++);
  printAt(chalk.greenBright.bold("   |||  "), column, row++);
  printAt(chalk.greenBright.bold("   |||  "), column, row++);
  printAt(chalk.greenBright.bold("||||||||"), column, row++);
};

const countDown = async function() {
  const startRow = Math.ceil(stdout.rows / 2 - 4);
  const startColumn = Math.ceil(stdout.columns / 2 - 23);
  await intervalCall(show3, 1000, 1, startRow, startColumn);
  await intervalCall(show2, 1000, 1, startRow, startColumn + 18);
  await intervalCall(show1, 1000, 1, startRow, startColumn + 36);
};

exports.showIcon = showIcon;
exports.countDown = countDown;
