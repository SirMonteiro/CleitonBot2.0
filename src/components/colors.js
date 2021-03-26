const randomint = require("./randomint");
const colors = ["#ff0000", "#00ff00", "#0000ff"];
module.exports = function () {
  return colors[randomint(0, 2)];
};
