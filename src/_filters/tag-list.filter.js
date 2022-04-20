module.exports = (tags) => {
  // should match the list in tags.njk
  return (tags || []).filter(
    (tag) => ["all", "nav", "post", "posts"].indexOf(tag) === -1
  );
};
