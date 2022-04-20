module.exports = (value, list, key) => {
  return list.find((item) => item[key] === value);
};
