const humanizeString = require("humanize-string");

module.exports = (str) => {
  if (str) {
    return humanizeString(str);
  }
  return str;
};
