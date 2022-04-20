module.exports = (value) => {
  if (!value) return '';
  const [title, subtitle] = value.split("-");
  if (subtitle) return subtitle.trim();
  return '';
};
