module.exports = {
  eleventyComputed: {
    eleventyNavigation: {
      key: (data) => data.title,
      parent: (data) => data.parent ?? `${data.locale.lang}-posts`,
    },
  },
};