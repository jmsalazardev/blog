module.exports = (value, currency) => {
  // TODO: Select currency from config file
  currency = currency ?? "clp";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
  }).format(value);
};
