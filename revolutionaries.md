---
layout: page
title: "Revolutionaries"
permalink: /revolutionaries/
---
{% assign sorted_posts = site.categories.revolutionaries | sort: 'date' %}
{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
