const { stdout } = process;

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

module.exports = { spaces, printAt, clearScreen };
