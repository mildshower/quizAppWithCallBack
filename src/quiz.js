const { stdin, stdout } = process;
const { readFileSync } = require("fs");
const { Say } = require("say");
const chalk = require("chalk");
const { startBorderAnimation } = require("./design");
const { printAt, clearScreen } = require("./utils");
const { getQuestions } = require("./getQuestions");
const { runOpeningAnimation } = require("./startingAnimations");

const say = new Say();
stdin.setEncoding("utf-8");

const getTimer = function() {
  return {
    counter: 20,
    timerId: 0,
    start: function() {
      this.stop();
      this.timerId = setInterval(() => {
        const timeMsg = chalk.blue(`◼︎ Seconds Remaining: ${this.counter}`);
        printAt(timeMsg, 20, stdout.rows - 3);
        if (this.counter == 0) stdin.emit("data", "\r");
        this.counter--;
      }, 1 * 1000);
    },
    stop: function() {
      clearInterval(this.timerId);
      this.counter = 20;
    }
  };
};

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

const declareScoreAndExit = function(skipped, correct) {
  const attempts = 10 - skipped;
  const accuracy = ((correct * 100) / attempts || 0).toFixed(2);
  speakScore(attempts, correct, accuracy);
  showScore(attempts, correct, accuracy);
};

const getScoreCalculator = function() {
  const questions = getQuestions("./data/.questions.json", readFileSync);
  let currQsNo = -1;
  let correctAns = 0;
  let skippedQs = 0;
  return function(pressedKey, timer) {
    const isFirstCall = currQsNo == -1;
    if (!isFirstCall && pressedKey == "\r") skippedQs++;
    if (!isFirstCall && pressedKey == questions[currQsNo].answer) correctAns++;
    if (!isFirstCall) timer.stop();
    if (currQsNo == 9) {
      declareScoreAndExit(skippedQs, correctAns);
      process.exit(0);
    }
    currQsNo++;
    showQuestion(questions[currQsNo], currQsNo + 1);
    timer.start();
  };
};

const handleEachKeyPress = function(calculateScore, timer, pressedKey) {
  let validKeys = "a,b,c,d,\r".split(",");
  if (validKeys.includes(pressedKey.toLowerCase())) {
    calculateScore(pressedKey.toLowerCase(), timer);
  }
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

const startQuiz = function() {
  showStartKeyToPress();
  const calculateScore = getScoreCalculator();
  const timer = getTimer();
  stdin.setRawMode(true);
  stdin.on("data", handleEachKeyPress.bind(null, calculateScore, timer));
};

const startApp = function() {
  startBorderAnimation();
  runOpeningAnimation();
  setTimeout(startQuiz, 5500);
};

startApp();
