module.exports = (value) => {
  if (!value) {
    return "";
  }

  if (value >= 90) {
    return "Universal Acclaim";
  }

  if (value >= 61) {
    return "Generally Favorable Reviews";
  }

  if (value >= 50 && value <= 60) {
    return "Mixed or Average Reviews";
  }
  if (value >= 20 && value <= 39) {
    return "Generally Unfavorable Reviews";
  }

  return "Overwhelming Dislike";
};
