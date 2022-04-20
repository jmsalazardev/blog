---
layout: posts.njk
eleventyNavigation:
  parent: en-home
  key: en-posts
  title: Posts
  order: 1
  icon: /assets/svg/articles.svg
title: Posts
description: Publicaciones de JMSalazarDev
image: https://lh3.googleusercontent.com/SuXAx00qCZZpQj-HnsoReQxK5lqOnqH4QMFOURnaSqMQef243MxCs_Cs6WzlrlMZeQectdWnY1gv9zDydaA#width=1280&height=400

pagination:
  data: collections.posts_en
  size: 24
  alias: posts
permalink: /{{ locale.lang }}/blog/{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber + 1 }}/{% endif %}

---
