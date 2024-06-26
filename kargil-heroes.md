---
layout: page
title: "Kargil War Heroes"
permalink: /kargil/
---
{% assign sorted_posts = site.categories.kargil-heroes | sort: 'date' %}
{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
