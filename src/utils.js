const { stdin, stdout } = process;
const chalk = require("chalk");

const spaces = function(num) {
  return " ".repeat(num >= 0 ? num : 0);
};

const printAt = function(str, xCoOrdinate, yCoOrdinate) {
  stdout.cursorTo(xCoOrdinate, yCoOrdinate);
  stdout.clearLine(0);
  stdout.write(str);
};

const clearScreen = function() {
  stdout.cursorTo(0, 0);
  stdout.clearScreenDown();
};

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

module.exports = { spaces, printAt, clearScreen, getTimer };
