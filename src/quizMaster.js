const { stdin } = process;
const { readFileSync } = require("fs");
const { startBorderAnimation } = require("./design");
const { getTimer, showCursor, hideCursor } = require("./utils");
const { getQuestions } = require("./getQuestions");
const { runOpeningAnimation } = require("./startingAnimations");
const {
  showQuestion,
  speakScore,
  showScore,
  showStartKeyToPress
} = require("./notify");

stdin.setEncoding("utf-8");

const declareScore = function(skipped, correct) {
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
    timer.stop();
    if (currQsNo == 9) {
      declareScore(skippedQs, correctAns);
      showCursor();
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

const startQuiz = function() {
  showStartKeyToPress();
  const calculateScore = getScoreCalculator();
  const timer = getTimer(20);
  stdin.setRawMode(true);
  stdin.on("data", handleEachKeyPress.bind(null, calculateScore, timer));
};

const startApp = function() {
  hideCursor();
  startBorderAnimation();
  runOpeningAnimation();
  setTimeout(startQuiz, 5500);
};

exports.startApp = startApp;
