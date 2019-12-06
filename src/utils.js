const { stdin, stdout } = process;

const intervalCall = function(callback, time, count, ...args) {
  let counter = 0;
  return new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      try {
        callback(...args);
      } catch (err) {
        reject(err);
      }
      counter++;
      if (counter == count) {
        resolve(true);
        clearInterval(timer);
      }
    }, time);
  });
};

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

const pause = async function(times) {
  await intervalCall(() => {}, times, 1);
};

module.exports = { intervalCall, spaces, printAt, clearScreen, pause };
