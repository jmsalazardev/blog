module.exports = (value) => {
  if (!value) return '';
  const [title] = value.split('-');
  if (title) return title.trim();
  return '';
};
