const d = document;
const $$ = (selector) => {
  return d.querySelectorAll(selector);
};

const $ = (selector) => {
  return d.querySelector(selector);
};

function commentsLazyLoad(target) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let d = document,
          s = document.createElement("script");
        s.src = "https://jmsalazardev.disqus.com/embed.js";
        s.setAttribute("data-timestamp", +new Date());
        (d.head || d.body).appendChild(s);

        observer.disconnect();
      }
    });
  });

  io.observe(target);
}

function iframeLazyLoad(target) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        if (iframe.hasAttribute("data-src")) {
          iframe.setAttribute("src", iframe.getAttribute("data-src"));
          iframe.removeAttribute("data-src");
        }
        observer.disconnect();
      }
    });
  });

  io.observe(target);
}

function imageLazyLoad(target) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.getAttribute("data-src");
        const width = img.getAttribute("data-width");
        const height = img.getAttribute("data-height");

        const url = new URL(src);

        let dpr = 1;
        if ([...img.classList].includes("logo")) {
          dpr = 2;
        } else if (window.devicePixelRatio) {
          dpr = window.devicePixelRatio;
        }

        let newWidth = Math.ceil(img.offsetWidth * dpr);
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

        img.setAttribute("width", newWidth);
        img.setAttribute("height", newHeight);
        img.classList.add('lazyloaded');

        if (url.host === 'lh3.googleusercontent.com') {
          img.src = `${src}=w${newWidth}-h${newHeight}-rw-c`;
        } else {
          img.src = src;
        }

        observer.disconnect();
      }
    });
  });

  io.observe(target);
}

const [collection] = window.location.pathname.split('/');


let items = $$("iframe");
items.forEach(iframeLazyLoad);

items = $$("img.lazy");
items.forEach(imageLazyLoad);

if (window.innerWidth <= 575) {
  const active = document.querySelector('.main-nav  ul li.active');
  if (active) {
    active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function () {
      console.log("ServiceWorker has been registered!");
    })
    .catch(console.error);
}

const disqusThread = document.getElementById("disqus_thread");
if (disqusThread) {
  commentsLazyLoad(disqusThread);
}
