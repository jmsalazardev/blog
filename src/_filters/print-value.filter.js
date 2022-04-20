module.exports = (value, source, separator = " , ") => {
  // TODO
  let data = value;
  let found;
  if (Array.isArray(value)) {
    data = value.map((item) => {
      found = source.find((element) => element.slug === item);
      if (found) {
        return `"${found.value}"`;
      }
      return `${item.trim()}`;
    });
  } else {
    data = data.trim();
    found = source.find((element) => element.slug === data);
    if (found) {
      // TODO fix for contentRating
      data = `${found.value}`;
      if (found["i18n"] && found["i18n"]["en"]) {
        data = `${found["i18n"]["en"]}`;
      }
    }
  }
  return data;
};
