const { stdout, stdin } = process;
const open = require("./open");
const chalk = require("chalk");
const { pause, clearScreen, printAt } = require("./utils.js");
const design = require("./design");
const { getQuestions } = require("./getQuestions");
const { Say } = require("say");
const say = new Say();

stdin.setEncoding("utf8");
stdin.pause();

const takeAnswer = function() {
  return new Promise((resolve, reject) => {
    stdin.resume();
    stdin.setRawMode(true);
    stdin.on("data", data => {
      if (["a", "b", "c", "d", "\r"].includes(data.toLowerCase())) {
        stdin.setRawMode(false);
        stdin.pause();
        clearInterval(timer);
        resolve(data);
      } else {
        printAt(chalk.red("Please press a valid Key"), 20, stdout.rows - 4);
      }
    });
    let count = 20;
    const timer = setInterval(() => {
      printAt(chalk.blue(`Seconds Remaining: ${count}`), 20, stdout.rows - 3);
      count--;
      if (count < 0) {
        clearInterval(timer);
        stdin.pause();
        resolve("\r");
      }
    }, 1000);
  });
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

const showQuestion = function(question, slNo, column, row) {
  clearScreen();
  speakQuestion(question, slNo);
  printAt(chalk.yellow(`${slNo}. ${question.question}`), column, row);
  showOptions(question.options, column, row);
  const instMsg =
    "◼︎ You can press A or B or C or D to choose an option and Enter to skip";
  printAt(instMsg, 20, stdout.rows - 5);
};

const getEvalInc = async function(givenAns, correctAns) {
  const increament = [0, 0];
  if (givenAns == "\r") {
    increament[0] = 1;
    return increament;
  }
  if (givenAns == correctAns) {
    increament[1] = 1;
    return increament;
  }
  say.stop();
  say.speak("Oops! Wrong Answer.", "Daniel");
  printAt(
    chalk.red(`Correct Answer is Option ${correctAns}`),
    Math.ceil(20),
    Math.ceil(stdout.rows - 4)
  );
  await pause(4000);
  return increament;
};

const handleQuestion = async function(evaluations, question, index) {
  const questionLen = question.question.length;
  showQuestion(
    question,
    index + 1,
    Math.ceil((stdout.columns - questionLen) / 2),
    Math.ceil((stdout.rows - 8) / 2)
  );
  const givenAns = await takeAnswer();
  const [skippedInc, correctInc] = await getEvalInc(givenAns, question.answer);
  evaluations.skipped += skippedInc;
  evaluations.correct += correctInc;
  return evaluations;
};

const waitedReduce = async function(array, asyncCallBack, initialCntxt) {
  let context = initialCntxt;
  for (let index = 0; index < array.length; index++) {
    context = await asyncCallBack(context, array[index], index);
  }
  return context;
};

const quitHandler = function(column, row) {
  printAt("Press 'Ctr + C' to quit", column, row);
  process.on("SIGINT", () => {
    clearScreen();
    process.exit(0);
  });
};

const showEval = function(skipped, correct, name) {
  const attempts = 10 - skipped;
  const accuracy = (correct * 100) / attempts || 0;
  const speakMsg = `Hi ${name}. You've attempted ${attempts} questions out of 10. In which ${correct} were correct and Your accuracy is ${accuracy.toFixed(
    2
  )}%`;
  say.stop();
  say.speak(speakMsg, "Samantha");
  const evalMsg1 = `Hi ${name}, Your Performance is`;
  const evalMsg2 = `Total: 10 | You Attempted: ${attempts} | Correct: ${correct} | Accuracy: ${accuracy.toFixed(
    2
  )} %\n`;
  clearScreen();
  const middleColumn = Math.ceil(stdout.columns / 2);
  const middleRow = Math.ceil(stdout.rows / 2);
  printAt(
    chalk.magentaBright(evalMsg1),
    middleColumn - Math.ceil(evalMsg1.length / 2),
    middleRow - 5
  );
  printAt(
    chalk.cyanBright(evalMsg2),
    middleColumn - Math.ceil(evalMsg2.length / 2),
    middleRow - 2
  );
};

const takeName = function() {
  return new Promise((resolve, reject) => {
    clearScreen();
    printAt(
      chalk.cyan(" Please Enter Your Name: "),
      Math.ceil(stdout.columns / 2 - 20),
      Math.ceil(stdout.rows / 2)
    );
    stdin.resume();
    stdin.once("data", name => {
      stdin.pause();
      clearScreen();
      resolve(name.slice(0, -1));
    });
  });
};

const runOpenAnimantion = async function() {
  await open.showIcon();
  let name = await takeName();
  printAt(
    chalk.magenta(`Welcome ${name}`),
    Math.ceil(stdout.columns / 2 - 10),
    Math.ceil(stdout.rows / 2)
  );
  design.mainInterval();
  say.speak(`Welcome ${name}.`, "Samantha");
  await pause(1000);
  await open.countDown();
  await pause(1000);
  say.speak("play", "Samantha");
  await pause(1000);
  return name;
};

const runQuiz = async function() {
  const questions = getQuestions("./data/.questions.json");
  const name = await runOpenAnimantion();
  const { skipped, correct } = await waitedReduce(questions, handleQuestion, {
    skipped: 0,
    correct: 0
  });
  showEval(skipped, correct, name);
  quitHandler(
    Math.ceil(stdout.columns / 2 - 12),
    Math.ceil(stdout.rows / 2 + 3)
  );
};

runQuiz();
