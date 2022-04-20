const breadcrumb = require("../../src/_data/breadcrumb.json");

module.exports = (page) => {
  const list = [];
  const { url } = page;
  const urlParts = url.split("/");
  urlParts.splice(urlParts.length - 2, 1);
  for (let position = 1; position <= urlParts.length; position++) {
    const item = breadcrumb[urlParts[position - 1]];
    if (item && item.position === position) {
      list.push(item);
    }
  }
  if (list.length > 0) {
    return `<ul>${list
      .map((li) => `<li><a href="${li.url}">${li.name}</a></li>`)
      .join("")}</ul>`;
  }

  return "";
};
