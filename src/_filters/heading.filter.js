module.exports = (str) => {
  if (!str) {
    return "";
  }

  const parts = str.split("-");
  if (parts.length > 1) {
    return `${parts[0].trim()} <span>${parts[1].trim()}</span>`;
  } else {
    return `${parts[0].trim()}`;
  }
};
