const fs = require("fs");

const getRandomNum = function(rangeNum) {
  return Math.floor(Math.random() * rangeNum);
};

const get10RandomIndecies = function() {
  const rangeNum = 41;
  let randomIndecies = [];
  while (randomIndecies.length < 10) {
    const num = getRandomNum(rangeNum);
    if (!randomIndecies.includes(num)) {
      randomIndecies.push(num);
    }
  }
  return randomIndecies;
};

const get10Questions = function(questions) {
  const questionIndecies = get10RandomIndecies();
  return questionIndecies.map(idx => questions[idx]);
};

const getQuestions = function(path, reader) {
  return get10Questions(JSON.parse(reader(path, "utf8")));
};

module.exports = {
  getRandomNum,
  get10Questions,
  getQuestions
};
