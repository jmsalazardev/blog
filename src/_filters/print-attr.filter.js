module.exports = (value, source, separator = " , ") => {
  // TODO
  let data = value;
  let found;
  if (Array.isArray(value)) {
    data = value
      .map((item) => {
        found = source.find((element) => element.slug === item);
        if (found) {
          return `${found.value}`;
        }
        return `${item.trim()}`;
      })
      .join(separator);
  } else {
    data = data.trim();
    found = source.find((element) => element.slug === data);
    if (found) {
      data = `${found.value}`;
    }
  }
  return data;
};
