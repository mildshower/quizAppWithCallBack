const { stdout } = process;
const chalk = require("chalk");
const { Say } = require("say");
const { printAt, clearScreen } = require("./utils.js");
const say = new Say();

const showOptions = function(options, column, row) {
  const { a, b, c, d } = options;
  printAt(chalk.cyan(`Option: A. ${a}`), column + 3, row + 2);
  printAt(chalk.cyan(`Option: B. ${b}`), column + 3, row + 3);
  printAt(chalk.cyan(`Option: C. ${c}`), column + 3, row + 4);
  printAt(chalk.cyan(`Option: D. ${d}`), column + 3, row + 5);
};

const speakQuestion = function(question, slNo) {
  const { a, b, c, d } = question.options;
  const speakingMsg = `Question number ${slNo}. ${question.question} Your Options are. Option A ${a}! Option B ${b}! Option C ${c}! Option D ${d}!`;
  say.stop();
  say.speak(speakingMsg, "Samantha");
};

const showQuestion = function(question, slNo) {
  const column = Math.ceil((stdout.columns - question.question.length) / 2);
  const row = Math.ceil((stdout.rows - 8) / 2);
  clearScreen();
  speakQuestion(question, slNo);
  printAt(chalk.yellow(`${slNo}. ${question.question}`), column, row);
  showOptions(question.options, column, row);
  const instMsg =
    "◼︎ You can press A or B or C or D to choose an option and Enter to skip";
  printAt(instMsg, 20, stdout.rows - 5);
};

const speakScore = function(attempts, correct, accuracy) {
  const speakMsg = `You've attempted ${attempts} questions out of 10. In which ${correct} were correct and Your accuracy is ${accuracy}%`;
  say.stop();
  say.speak(speakMsg, "Samantha");
};

const showScore = function(attempts, correct, accuracy) {
  const scoreMsg = `Total: 10 | You Attempted: ${attempts} | Correct: ${correct} | Accuracy: ${accuracy} %\n`;
  clearScreen();
  const middleColumn = Math.ceil(stdout.columns / 2);
  const middleRow = Math.ceil(stdout.rows / 2);
  printAt(
    chalk.cyanBright(scoreMsg),
    middleColumn - Math.ceil(scoreMsg.length / 2),
    middleRow - 2
  );
};

const showStartKeyToPress = function() {
  clearScreen();
  const initiationMsg = "PRESS ENTER TO START";
  printAt(
    chalk.redBright.bold(initiationMsg),
    Math.round(stdout.columns / 2 - 10),
    Math.round(stdout.rows / 2)
  );
  say.speak(initiationMsg, "Samantha");
};

module.exports = { showQuestion, speakScore, showScore, showStartKeyToPress };
