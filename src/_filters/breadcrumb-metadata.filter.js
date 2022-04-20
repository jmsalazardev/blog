const site = require("../../src/_data/site");
const breadcrumb = require("../../src/_data/breadcrumb.json");

module.exports = (page, data) => {
  const itemListElement = [];
  const { url } = page;
  const urlParts = url.split("/");

  urlParts.splice(urlParts.length - 2, 1);

  for (let position = 1; position <= urlParts.length; position++) {
    const item = breadcrumb[urlParts[position - 1]];
    if (item && item.position === position) {
      itemListElement.push({
        "@type": "ListItem",
        position: item.position,
        name: item.name,
        item: `${site.url}${item.url}`,
      });
    }
  }

  if (data) {
    itemListElement.push({
      "@type": "ListItem",
      position: itemListElement.length + 1,
      name: data.title,
      item: `${site.url}${page.url}`,
    });
  }

  const metadata = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
  // console.log(metadata);

  return JSON.stringify(metadata);
};
