module.exports = (game, page) => {
  const metadata = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: game.title,
    description: game.description,
    image: [game.image],
    brand: {
      "@type": "Brand",
      name: game.developers.join(","),
    },
  };

  if (game.rating) {
    metadata["aggregateRating"] = {
      "@type": "AggregateRating",
      ...game.rating,
    };
  }
  const offers = game.prices.map((item) => {
    const data = {
      "@type": "Offer",
      name: item.name,
      url: `${item.url}`,
      price: item.price,
      priceCurrency: item.currency.toString().toUpperCase(),
      seller: {
        "@type": "Organization",
        name: item.store,
      },
      category: "VideoGame",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    };
    if (item.sku) {
      data.sku = item.sku;
    }
    return data;
  });
  if (offers.length > 0) {
    metadata["offers"] = offers;
  }
  return JSON.stringify(metadata);
};
