const { stdin, stdout } = process;
const { Say } = require("say");
const chalk = require("chalk");
const { spaces, printAt, clearScreen } = require("./utils");
const { getQuestions } = require("./getQuestions");

const say = new Say();
stdin.setEncoding("utf-8");

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

const startTimer = function() {
  let counter = 20;
  const timerId = setInterval(() => {
    printAt(`Seconds Remaining: ${counter}`, 30, stdout.rows - 5);
    counter--;
  }, 1 * 1000);
  setTimeout(() => {
    clearInterval(timerId);
  }, 20 * 1000);
  return timerId;
};

const getScoreCalculator = function() {
  const questions = getQuestions("./data/.questions.json");
  let currQsNo = -1;
  let correctAns = 0;
  let skippedQs = 0;
  return function(pressedKey) {
    const isFirstCall = currQsNo == -1;
    if (!isFirstCall && pressedKey == "\r") skippedQs++;
    if (!isFirstCall && pressedKey == questions[currQsNo].answer) correctAns++;
    //f (!isFirstCall) clearInterval(timerId);
    if (currQsNo == 9) {
      declareScoreAndExit(skippedQs, correctAns);
      process.exit(0);
    }
    currQsNo++;
    showQuestion(questions[currQsNo], currQsNo + 1);
    //const timerId = startTimer();
  };
};

const handleEachKeyPress = function(calculateScore, pressedKey) {
  let validKeys = "a,b,c,d,\r".split(",");
  if (validKeys.includes(pressedKey.toLowerCase())) {
    calculateScore(pressedKey.toLowerCase());
  }
};

const showOpenig = function() {
  clearScreen();
  const initiationMsg = "press enter to start";
  printAt(
    initiationMsg,
    Math.round(stdout.columns / 2 - 10),
    Math.round(stdout.rows / 2)
  );
  say.speak(initiationMsg, "Samantha");
};

const runQuiz = function() {
  showOpenig();
  const calculateScore = getScoreCalculator();
  stdin.setRawMode(true);
  stdin.on("data", handleEachKeyPress.bind(null, calculateScore));
};

runQuiz();
