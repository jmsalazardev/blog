// https://jec.fyi/blog/setting-up-seo-and-google-analytics

const sass = require("sass");
const fs = require("fs");
const CleanCSS = require("clean-css");
const svgContents = require("eleventy-plugin-svg-contents");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginTOC = require("eleventy-plugin-nesting-toc");
const pluginPWA = require("11ty-plugin-pwa");
const pluginSEO = require("eleventy-plugin-seo");
const pluginManifest = require("@navillus/eleventy-plugin-manifest");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const compressor = require("node-minify");
const dedent = require("dedent");
const metadata = require("./src/_data/metadata.json");
const site = require("./src/_data/site");
const string = require("string");
const i18n = require("eleventy-plugin-i18n");

const translations = require('./src/_data/i18n');

const cssCleaner = new CleanCSS({});
const cssMap = {};
const jsMap = {};

const imageTransform = require("./src/_transforms/image.transform");
const tagListFilter = require("./src/_filters/tag-list.filter");
const readableDateFilter = require("./src/_filters/readable-date.filter");
const htmlDateStringFilter = require("./src/_filters/html-date-string.filter");
const headingFilter = require("./src/_filters/heading.filter");
const findItemFilter = require("./src/_filters/find-item.filter");
const printValueFilter = require("./src/_filters/print-value.filter");
const shortTitleFilter = require("./src/_filters/short-title.filter");
const subtitleFilter = require("./src/_filters/subtitle.filter");
const printAttrFilter = require("./src/_filters/print-attr.filter");
const activeEntryFilter = require("./src/_filters/active-entry.filter");

const { ELEVENTY_APP_ENV } = process.env;

const isProduction = ELEVENTY_APP_ENV === 'production';

const compileJS = async (tmplClass) => new Promise((resolve, reject) => {
  compressor.minify({
    compressor: 'gcc',
    input: [`assets/js/${tmplClass}.js`],
    output: '/dev/null',
    callback: (err, min) => {
      if (err) return reject(err);
      jsMap[tmplClass] = min;
      resolve(tmplClass);
    },
  });
});

const compileSass = async (tmplClass) => new Promise((resolve) => {
  const result = sass.compile(`src/design/${tmplClass}.scss`,{
    sourceMap: false,
    outputStyle: 'compressed',
  });

  const css = cssCleaner.minify(result.css.toString());
  cssMap[tmplClass] = css.styles;
  resolve(tmplClass);
});

module.exports = (eleventyConfig) => {
  eleventyConfig.addWatchTarget("src");

  
  eleventyConfig.on("beforeBuild", async () => {
    await Promise.all([
      compileJS("main"),
      compileSass("main"),
      compileSass("simple"),
      compileSass("home"),
      compileSass("tags"),
      compileSass("posts"),
      compileSass("post"),
    ]).then((values) => {
      console.log(values);
    });
  });
  

  //#region Plugins

  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'es-CL'
    }
  });

  eleventyConfig.addPlugin(pluginManifest, site.manifest);

  eleventyConfig.addPlugin(pluginPWA, {
    swDest: "./public/sw.js",
    globDirectory: "./public",
    
  });
 
  eleventyConfig.addPlugin(pluginSEO, {
    title: metadata.title,
    description: metadata.description,
    url: metadata.url,
    author: metadata.author.name,
    twitter: metadata.social.twitter.id,
    image:
      "https://lh3.googleusercontent.com/bLprK4Iq9bJiCDs7f9d6o69yKNB8m3tqhlCUbq4xXKM88W7-xfik7f0SA8UhUzkICCL12iUZ9JqRE0pn7LY",
  });

  eleventyConfig.addPlugin(pluginTOC);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(svgContents);

  //#endregion

  //#region Transforms

  eleventyConfig.addTransform("imagesResponsiver", imageTransform);

  //#endregion

  //#region Filters
  eleventyConfig.addFilter("cssmin", function (code) {
    return cssCleaner.minify(code).styles;
  });

  eleventyConfig.addFilter("toString", function (value) {
    return JSON.stringify(value);
  });

  eleventyConfig.addFilter("inlineCSS", (tmplClass) => {
    return cssMap[tmplClass] ?? "";
  });

  eleventyConfig.addFilter("inlineJS", (tmplClass) => {
    return jsMap[tmplClass] ?? jsMap["main"];
  });

  
  eleventyConfig.addFilter("filterTagList", tagListFilter);

  eleventyConfig.addFilter("readableDate", readableDateFilter);

  eleventyConfig.addFilter("htmlDateString", htmlDateStringFilter);

  eleventyConfig.addFilter("heading", headingFilter);

  eleventyConfig.addFilter("shortTitle", shortTitleFilter);

  eleventyConfig.addFilter("subtitle", subtitleFilter);

  // eleventyConfig.addFilter("humanize", humanizeFilter);

  eleventyConfig.addFilter("findItem", findItemFilter);

  eleventyConfig.addFilter("printValue", printValueFilter);

  eleventyConfig.addFilter("printAttr", printAttrFilter);

  eleventyConfig.addFilter("shortTitle", shortTitleFilter);

  eleventyConfig.addFilter("activeEntry", activeEntryFilter);

  //#endregion

  //#region PassthroughCopy
  eleventyConfig.addPassthroughCopy({
    "assets/icon": ".",
  });
  eleventyConfig.addPassthroughCopy({
    "assets/.well-known": ".well-known",
  });

  //#endregion

  //#region Shortcode
  
  eleventyConfig.addShortcode("map", (location) => {
    return dedent`<p>${location.address}<br />${location.city}, ${location.country}</p>
      <div class="frame"><iframe title="View location" data-src="https://www.google.com/maps/d/u/0/embed?mid=1_267kEG2rtvG_3vTysxt8lhMyw-F3Vir&ll=${location.latitude},${location.longitude}&z=${location.zoom}&output=embed"></iframe></div>`;
  });

  eleventyConfig.addShortcode("youtube", (id, allow) => {
    return dedent`<div class="frame"><iframe data-src="https://www.youtube.com/embed/${id}" title="Ver Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  });

  eleventyConfig.addShortcode("gallery", (images) => {
    const output = images.map(
      (
        image
      ) => `<a href="${image.src}" rel="noopener" target="_blank" title="${image.title}">
    <img alt="${image.alt}" src="${image.src}=w100-h100-rw-c" data-src="${image.src}=w${image.width}-h${image.height}-rw-c" width="100" height="100" />
  </a>`
    );
    return dedent`<div class="gallery">${output.join(" ")}</div>`;
  });
  
  //#endregion


  eleventyConfig.addLayoutAlias("tag", "layouts/tag.njk");

  /* Markdown Overrides */

  const markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    placement: "after",
    class: "direct-link",
    symbol: "#",
    level: [1,2,3,4],
  });

  eleventyConfig.setLibrary("md", markdownLibrary);

  
  eleventyConfig.addCollection("tags", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function (item) {
      if ("tags" in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(item => ![
          'all',
          'nav',
          'post',
        ].includes(item));
        for (const tag of tags) {
          tagSet.add(string(tag).slugify().toString());
        }
      }
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet].sort();
  });

  
  eleventyConfig.addCollection("posts", function (collection) {
    return collection.getFilteredByGlob("./src/posts/*.md").reverse();
  });
  

  eleventyConfig.addCollection("posts_en", function (collection) {
    return collection.getFilteredByGlob("./src/en/posts/*.md").reverse();
  });

  eleventyConfig.addCollection("posts_es", function (collection) {
    return collection.getFilteredByGlob("./src/es/posts/*.md").reverse();
  });

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("public/404.html");

        browserSync.addMiddleware("*", (req, res) => {

          if (req.url === '/') {
            res.writeHead(302, {
              location: '/es/'
            });
            return res.end();
          }
          
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
    https: true,
  });

  return {
    // Control which files Eleventy will process
    // e.g.: *.md, *.njk, *.html, *.liquid
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    pathPrefix: "/",

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk",

    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      layouts: "_layouts"
    },
  };
};
