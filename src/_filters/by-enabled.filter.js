module.exports = (posts, enabled) => {
  return posts.filter((post) => post.enabled === enabled);
};
