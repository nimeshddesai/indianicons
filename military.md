---
layout: page
title: "Military Heroes"
permalink: /military/
---
{% assign sorted_posts = site.categories.military | sort: 'date' %}
{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
