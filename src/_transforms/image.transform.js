const queryString = require("query-string");

module.exports = (content, outputPath) => {
  if (!outputPath.endsWith(".html")) {
    return content;
  }

  return content.replace(
    /<img\s+[^>]*src="([^"]*)"\s+[^>]*alt="([^"]*)"[^>]*>/gi,
    function ($0, src, alt) {
      var [base, hash] = src.split("#");
      var [base, params] = base.split("=");
      var css = "responsive";
      let height = 0;
      let width = 360;
      let crop = "square";

      if (hash) {
        hash = `${hash}`.replace(/&amp;/g, "&");

        hash = queryString.parse(hash, {
          parseBooleans: true,
          parseNumbers: true,
        });

        if (hash["class"]) {
          css = `${hash["class"]}`.split(",").join(" ");
        }

        if ("height" in hash) {
          height = parseInt(hash.height, 10);
        }

        if ("width" in hash) {
          width = parseInt(hash.width, 10);
        }

        if ("crop" in hash) {
          crop = hash.crop;
        }
      }

      let newWidth = 360;
      let newHeight = 0;
      let aspectRatio = 0;
      if (width > height) {
        aspectRatio = width / height;
        newHeight = Math.round(newWidth / aspectRatio);
      } else if (height > width) {
        aspectRatio = height / width;
        newHeight = Math.round(newWidth * aspectRatio);
      } else {
        newHeight = newWidth;
      }

      img = base;
      if (img.startsWith("https://lh3.googleusercontent.com")) {
        let cropping = "";
        if (crop === "square") {
          cropping = "-c";
        } else if (crop === "smart") {
          cropping = "-p";
        }

        img = `${img}=w${newWidth}-h${newHeight}-rw${cropping}`;
      } else if (img.startsWith("https://blogger.googleusercontent.com")) {
        let cropping = "";
        if (crop === "square") {
          cropping = "-c";
        } else if (crop === "smart") {
          cropping = "-p";
        }
        const url = new URL(img);
        const parts = url.pathname.split('/');
        parts[parts.length - 2] = `${img}=w${newWidth}-h${newHeight}-rw${cropping}`;
        url.pathname = parts.join('/');
        url.hash = '';

        img = url.toString();
      }

      img = `data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20${width}%20${height}'%3E%3C/svg%3E`;

      return `<img data-width="${width}" data-height="${height}" data-src="${base}" src="${img}" alt="${alt}" class="lazy ${css}" width="${width}" height="${height}" /><noscript><img width="${width}" height="${height}" src="${base}=w${width}-h${height}" /></noscript>`;
    }
  );
};
