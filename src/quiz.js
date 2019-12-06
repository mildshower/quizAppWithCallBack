const { stdin, stdout } = process;
const { Say } = require("say");
const chalk = require("chalk");
const { spaces, printAt, clearScreen } = require("./utils");
const { getQuestions } = require("./getQuestions");
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

const runQuiz = function() {
  const questions = getQuestions("./data/.questions.json");
  showQuestion(questions[0], 1);
};

runQuiz();
